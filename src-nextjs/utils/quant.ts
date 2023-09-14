import { QuantClient, types } from '@quantcdn/quant-client'

const config:types.Config = {
  organization: process.env.QUANT_ORGANIZATION,
  project: process.env.QUANT_PROJECT,
  token: process.env.QUANT_TOKEN
}

export const quant = new QuantClient(config)
