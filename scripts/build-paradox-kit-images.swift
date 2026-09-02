import AppKit
import ImageIO

// Deterministically arrange supplied photos; never generate product hardware.
struct Kit: Decodable {
    let id, panel, keypad, detector, `internal`, battery, external: String
}
let root = CommandLine.arguments[1]
let manifest = URL(fileURLWithPath: CommandLine.arguments[2])
let kits = try JSONDecoder().decode([Kit].self, from: Data(contentsOf: manifest))
precondition(kits.count == 8)
let output = URL(fileURLWithPath: root + "/public/assets/alarm/kits")
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
var cache: [String: NSImage] = [:]
func photo(_ path: String) -> NSImage {
    if let cached = cache[path] { return cached }
    let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: root + "/public" + path) as CFURL, nil)!
    let cg = CGImageSourceCreateThumbnailAtIndex(source, 0, [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceThumbnailMaxPixelSize: 1200,
        kCGImageSourceCreateThumbnailWithTransform: true
    ] as CFDictionary)!
    let bitmap = NSBitmapImageRep(cgImage: cg)
    var minX = cg.width, minY = cg.height, maxX = 0, maxY = 0
    for y in stride(from: 0, to: cg.height, by: 2) {
        for x in stride(from: 0, to: cg.width, by: 2) {
            guard let c = bitmap.colorAt(x: x, y: y)?.usingColorSpace(.deviceRGB) else { continue }
            if c.alphaComponent > 0.2 && min(c.redComponent, c.greenComponent, c.blueComponent) < 0.94 {
                minX = min(minX, x); minY = min(minY, y)
                maxX = max(maxX, x); maxY = max(maxY, y)
            }
        }
    }
    let x = max(0, minX - 14), y = max(0, minY - 14)
    let right = min(cg.width, maxX + 14), bottom = min(cg.height, maxY + 14)
    let crop = cg.cropping(to: CGRect(x: x, y: y, width: right - x, height: bottom - y))!
    let result = NSImage(cgImage: crop, size: NSSize(width: crop.width, height: crop.height))
    cache[path] = result
    return result
}
for kit in kits {
    let canvas = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1200, pixelsHigh: 1200,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    let context = NSGraphicsContext(bitmapImageRep: canvas)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    context.imageInterpolation = .high
    NSColor.white.setFill()
    NSRect(x: 0, y: 0, width: 1200, height: 1200).fill()
    func place(_ path: String, _ x: Double, _ top: Double, _ w: Double, _ h: Double) {
        precondition(x >= 50 && top >= 50 && x + w <= 1150 && top + h <= 1150)
        let image = photo(path)
        let scale = min(w / image.size.width, h / image.size.height)
        let dw = image.size.width * scale, dh = image.size.height * scale
        image.draw(in: NSRect(x: x + (w - dw) / 2, y: 1200 - top - (h + dh) / 2, width: dw, height: dh),
            from: .zero, operation: .sourceOver, fraction: 1)
    }
    place(kit.panel, 70, 95, 750, 435)
    place(kit.external, 900, 95, 230, 435)
    place(kit.keypad, 65, 660, 380, 335)
    place(kit.battery, 480, 640, 305, 265)
    place(kit.internal, 535, 950, 185, 180)
    place(kit.detector, 825, 700, 145, 290)
    place(kit.detector, 990, 700, 145, 290)
    context.flushGraphics()
    NSGraphicsContext.restoreGraphicsState()
    let data = canvas.representation(using: .jpeg, properties: [.compressionFactor: 0.92])!
    try data.write(to: output.appendingPathComponent(kit.id + ".jpg"), options: .atomic)
    print("\(kit.id): 1200 × 1200, \(data.count) bytes")
}
