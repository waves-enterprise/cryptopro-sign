import { exec } from 'child_process'
import { logError } from './logUtils'
import { CERTIFICATE_PIN } from '../config'
import { InternalException } from '../types/errors'
import * as tempy from 'tempy'
import { readFile, unlink, writeFile } from 'fs/promises'
import { dirname } from 'path'

const execute = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        return reject(stdout || err.message)
      } else {
        resolve(stdout)
      }
    })
  })
}

let contrainerHash: string | null = null

const getContainerHash = async () => {
  if (!contrainerHash) {
    const response = await execute('certmgr -list')
    const match = response.match(/SHA1 Hash\s*: (\w+)$/m)
    if (!match) {
      throw new InternalException('Cannot get container hash. It seems that service is not correctly configured')
    }
    contrainerHash = match[1]
  }
  return contrainerHash
}

export const cryptoProSign = async (str: string): Promise<string> => {
  const containerHash = await getContainerHash()
  try {
    const tempFile = tempy.file({ extension: 'unsigned' })
    const signedFile = tempFile + '.sgn'
    await writeFile(tempFile, str)
    const dirName = dirname(tempFile)
    // eslint-disable-next-line max-len
    const cmd = `cryptcp -signf -dir "${dirName}" -thumbprint "${containerHash}" -norev -nochain "${tempFile}" -cert -der -strict -hashAlg "1.2.643.7.1.1.2.2" -detached -pin "${CERTIFICATE_PIN}"`
    await execute(cmd)
    const result = await readFile(signedFile)
    await unlink(signedFile)
    await unlink(tempFile)
    return result.toString('base64')
  } catch (e) {
    logError(`sign error ${e}`, '', 'СryptoProSign')
    throw new InternalException('Failed to create sign. It seems that service is not correctly configured')
  }
}
