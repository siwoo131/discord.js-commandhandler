import { type Client, Collection } from 'discord.js'
import type { MessageComponent } from './Component.js'
import { interactionCreate } from './utils/index.js'
import {
  loadModule,
  reloadModule,
  deloadModule,
  DeloadOptions,
  ReloadOptions,
} from 'discommand'
import type { ComponentsHandlerOptions } from './types.js'

/**
 * @__PURE__
 * @deprecated use {@link ComponentPlugin}.
 * */
export class ComponentHandler {
  public modules: Collection<string, MessageComponent> = new Collection()
  public constructor(
    public readonly client: Client,
    public readonly options: ComponentsHandlerOptions
  ) {
    client.on('ready', () => interactionCreate(this, client))
  }

  public load(modules: MessageComponent[]) {
    modules.forEach(module => {
      this.modules.set(module.name, module)
      console.log(`[discommand-message-component] ${module.name} is loaded.`)
    })
  }

  public deload(options: DeloadOptions<MessageComponent>[]) {
    options.forEach(option => {
      const { module, fileDir } = option
      this.modules.delete(module.name)
      if (fileDir) delete require.cache[require.resolve(fileDir)]
      console.log(`[discommand-message-component] ${module.name} is deloaded.`)
    })
  }

  public reload(options: ReloadOptions<MessageComponent>[]) {
    options.forEach(option => {
      const { module, fileDir } = option
      this.modules.delete(module.name)
      delete require.cache[require.resolve(fileDir)]
      this.load([module])
      console.log(`[discommand-message-component] ${module.name} is reloaded.`)
    })
  }

  public loadAll() {
    loadModule<MessageComponent>(this.options.directory) //
      .then(module => this.load(module))
  }

  public reloadAll() {
    this.reload(reloadModule(this.options.directory))
  }

  public deloadAll() {
    this.deload(deloadModule<MessageComponent>(this.options.directory))
  }
}
