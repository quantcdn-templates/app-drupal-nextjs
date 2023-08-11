import * as DrupalClient from "../drupal"
import { HealthCheck } from "./healthcheck"


class DrupalHealthCheck implements HealthCheck {
  async startup() : Promise<boolean> {
    let status = true
    try {
      DrupalClient.drupal.getResourceByPath("/")
    } catch (error) {
      status = false
    }
    return new Promise(resolve => resolve(status))
  }
  async ready() : Promise<boolean> {
    let status = true
    return new Promise(resolve => resolve(status))
  }  
  async alive() : Promise<boolean> {
    let status = true
    return new Promise(resolve => resolve(status))
  }
}

export const drupal = new DrupalHealthCheck()