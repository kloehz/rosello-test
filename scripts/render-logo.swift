import Foundation
import PDFKit
import AppKit

let input = URL(fileURLWithPath: "logos, colores y tipografia.pdf")
let output = URL(fileURLWithPath: "assets/brand/logo-rossello.png")
let preview = URL(fileURLWithPath: "assets/brand/brand-guide-page.png")

guard let document = PDFDocument(url: input), let page = document.page(at: 0) else {
  fputs("Unable to open PDF\n", stderr)
  exit(1)
}

let box = page.bounds(for: .mediaBox)
let scale: CGFloat = 3.0
let pageSize = NSSize(width: box.width * scale, height: box.height * scale)
let pageImage = NSImage(size: pageSize)
pageImage.lockFocus()
NSColor.white.setFill()
NSRect(origin: .zero, size: pageSize).fill()
let ctx = NSGraphicsContext.current!.cgContext
ctx.saveGState()
ctx.scaleBy(x: scale, y: scale)
page.draw(with: .mediaBox, to: ctx)
ctx.restoreGState()
pageImage.unlockFocus()

func writePNG(_ image: NSImage, to url: URL) {
  guard let tiff = image.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff),
        let data = bitmap.representation(using: .png, properties: [:]) else {
    fputs("Unable to encode PNG\n", stderr)
    exit(1)
  }
  try! data.write(to: url)
}
writePNG(pageImage, to: preview)

// Crop the compact logo variant from the rendered brand guide. Coordinates are tuned
// against the visual PDF guide and keep the PDF artwork, not a text recreation.
let pixelWidth = Int(pageSize.width)
let pixelHeight = Int(pageSize.height)
let cropRect = CGRect(
  x: CGFloat(pixelWidth) * 0.18,
  y: CGFloat(pixelHeight) * 0.47,
  width: CGFloat(pixelWidth) * 0.64,
  height: CGFloat(pixelHeight) * 0.45
)

guard let cg = pageImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  fputs("Unable to read rendered page\n", stderr)
  exit(1)
}
let actualWidth = CGFloat(cg.width)
let actualHeight = CGFloat(cg.height)
let actualCropRect = CGRect(
  x: actualWidth * 0.12,
  y: actualHeight * 0.62,
  width: actualWidth * 0.38,
  height: actualHeight * 0.16
)
print("page pixels \(cg.width)x\(cg.height), crop \(actualCropRect)")
guard let cropped = cg.cropping(to: actualCropRect) else {
  fputs("Unable to crop logo\n", stderr)
  exit(1)
}
let logoImage = NSImage(cgImage: cropped, size: NSSize(width: actualCropRect.width, height: actualCropRect.height))
writePNG(logoImage, to: output)
print("Rendered logo to \(output.path)")
