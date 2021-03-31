import { join } from 'path'
import carbone from 'carbone'
import { writeFileSync } from 'fs'

export const DEFAULT_base_template_path = join(process.cwd(), 'report', 'templates')
export const DEFAULT_base_report_path = join(process.cwd(), 'report')

export type PrintInput = {
  data: any;
  template: string;
  destination: string;
  base_template_path?: string;
  base_report_path?: string;
}

export async function print(input: PrintInput): Promise<string> {
  let bt = input.base_template_path ? input.base_template_path : DEFAULT_base_template_path
  let br = input.base_report_path ? input.base_report_path : DEFAULT_base_report_path
  let temp_path = join(bt, input.template)
  const render_result: Buffer = await new Promise((resolve, reject) => {
    carbone.render(temp_path, input.data, (err, result: Buffer) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
  const report_filename = join(br, input.destination)
  writeFileSync(report_filename, render_result)
  return report_filename
}