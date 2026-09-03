import AppKit
import ImageIO

// Crop only the supplied photos; no hardware is generated or retouched.
let root = CommandLine.arguments[1] + "/public/assets/alarm/"
let boards: [(String, CGRect)] = [
    ("mg5050", CGRect(x: 27, y: 110, width: 365, height: 198)),
    ("sp5500", CGRect(x: 51, y: 112, width: 318, height: 196)),
]
for (model, bounds) in boards {
    let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: root + "paradox-" + model + "-board.jpg") as CFURL, nil)!
    let original = CGImageSourceCreateImageAtIndex(source, 0, nil)!
    let crop = original.cropping(to: bounds)!
    let canvas = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 421, pixelsHigh: 421,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: canvas)!
    NSColor.clear.setFill()
    NSRect(x: 0, y: 0, width: 421, height: 421).fill()
    NSImage(cgImage: crop, size: bounds.size).draw(in: NSRect(
        x: (421 - bounds.width) / 2, y: (421 - bounds.height) / 2,
        width: bounds.width, height: bounds.height))
    NSGraphicsContext.restoreGraphicsState()
    try canvas.representation(using: .png, properties: [:])!.write(
        to: URL(fileURLWithPath: root + "paradox-" + model + "-board-only.png"), options: .atomic)
}
