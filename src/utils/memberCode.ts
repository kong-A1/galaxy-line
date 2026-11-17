import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

/** The member code as a QR code, ready for an <img src> (a data URL) */
export function qrDataUrl(code: string, size = 240): Promise<string> {
  return QRCode.toDataURL(code, { width: size, margin: 1, errorCorrectionLevel: 'M' })
}

/** Draws the member code as a Code 128 barcode into an <svg> (no text under the bars: the code is shown by the screen) */
export function drawBarcode(target: SVGSVGElement, code: string) {
  JsBarcode(target, code, {
    format: 'CODE128',
    displayValue: false,
    height: 80,
    width: 2,
    margin: 0,
    background: 'transparent',
    lineColor: '#000000',
  })
}
