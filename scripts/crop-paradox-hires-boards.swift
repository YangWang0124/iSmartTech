import AppKit
import ImageIO

// Pixel crops of user-supplied photos: no generated or retouched hardware.
// Coordinates are in source pixels, measured from the top-left corner.
let root = CommandLine.arguments[1] + "/public/assets/alarm/"
let boards: [(String, CGRect)] = [
    ("mg5050", CGRect(x: 89, y: 73, width: 750, height: 406)),
    ("sp5500", CGRect(x: 48, y: 250, width: 1183, height: 778)),
]
for (model, bounds) in boards {
    let input = URL(fileURLWithPath: root + "paradox-" + model + "-board-hires.webp")
    guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
          let original = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fatalError("Cannot read \(input.path)")
    }
    precondition(CGRect(x: 0, y: 0, width: original.width, height: original.height).contains(bounds))
    let cropped = original.cropping(to: bounds)!
    let bitmap = NSBitmapImageRep(cgImage: cropped)
    let output = URL(fileURLWithPath: root + "paradox-" + model + "-board-hires.png")
    try bitmap.representation(using: .png, properties: [:])!.write(to: output, options: .atomic)
    print("\(model): \(cropped.width) × \(cropped.height), source-resolution crop")
}
