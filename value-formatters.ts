import { FileFormat } from './file-format-spec'
import { zeroPad } from './utils'

export interface ValueFormatter {
  unit: FileFormat.ValueUnit
  format(v: number): string
}

export class RawValueFormatter implements ValueFormatter {
  unit: FileFormat.ValueUnit = 'none'
  format(v: number) {
    return v.toLocaleString()
  }
}

export class TimeFormatter implements ValueFormatter {
  private multiplier: number

  constructor(public unit: 'nanoseconds' | 'microseconds' | 'milliseconds' | 'seconds') {
    if (unit === 'nanoseconds') this.multiplier = 1e-9
    else if (unit === 'microseconds') this.multiplier = 1e-6
    else if (unit === 'milliseconds') this.multiplier = 1e-3
    else this.multiplier = 1
  }

  format(v: number) {
    const s = v * this.multiplier

    const minutes = zeroPad(Math.floor(s / 60).toString(10), 2)
    const seconds = zeroPad(Math.floor(s % 60).toString(10), 2)
    const milliseconds = zeroPad((Math.floor(s * 1000) % 1000).toString(10), 3)

    return `${minutes}:${seconds}.${milliseconds}`
  }
}

export class ByteFormatter implements ValueFormatter {
  unit: FileFormat.ValueUnit = 'bytes'

  format(v: number) {
    if (v < 1024) return `${v.toFixed(0)} B`
    v /= 1024
    if (v < 1024) return `${v.toFixed(2)} KB`
    v /= 1024
    if (v < 1024) return `${v.toFixed(2)} MB`
    v /= 1024
    return `${v.toFixed(2)} GB`
  }
}
