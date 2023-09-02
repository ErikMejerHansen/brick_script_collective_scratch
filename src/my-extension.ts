import { ExtensionDefinition, BlockTypes } from "./models";
/*
 * Simple example extension.
 * You can find more information here: https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md
 */
class MyExtension {
  private sendVmCommand


  constructor(sendVmCommand) {
    this.sendVmCommand = sendVmCommand
  }

  public getInfo(): ExtensionDefinition {
    return {
      id: "MyExtension",
      name: "Consensus",
      color1: "#F78E69",
      color2: "#F1BB87",
      color3: "#F1BB87",
      menus: {
        colorMenu: {
          items: ['Red', 'Green', 'Blue']
        },

        pressedMenu: {
          items: ['Pressed', 'Released']
        },
      },
      blockIconURI: null,
      blocks: [
        {
          blockType: BlockTypes.Hat,
          arguments: {
            COLOR: {
              type: 'number',
              menu: 'colorMenu'
            }
          },
          opcode: "any_see_color",
          text: "Any see [COLOR]",
        },
        {
          blockType: BlockTypes.Hat,
          arguments: {
            COLOR: {
              type: 'number',
              menu: 'colorMenu'
            }
          },
          opcode: "most_see_color",
          text: "Most see [COLOR]",
        },
        {
          blockType: BlockTypes.Hat,
          arguments: {
            COLOR: {
              type: 'number',
              menu: 'colorMenu'
            }
          },
          opcode: "all_see_color",
          text: "All see [COLOR]",
        },

        {
          blockType: BlockTypes.Hat,
          arguments: {
            PRESSED: {
              type: 'number',
              menu: 'pressedMenu'
            }
          },
          opcode: "any_pressed",
          text: "Any buttons are [PRESSED]",
        },
        {
          blockType: BlockTypes.Hat,
          arguments: {
            PRESSED: {
              type: 'number',
              menu: 'pressedMenu'
            }
          },
          opcode: "most_pressed",
          text: "Most buttons are [PRESSED]",
        },
        {
          blockType: BlockTypes.Hat,
          arguments: {
            PRESSED: {
              type: 'number',
              menu: 'pressedMenu'
            }
          },
          opcode: "all_pressed",
          text: "All buttons are [PRESSED]",
        },
        {
          blockType: BlockTypes.Command,
          arguments: {
            DURATION: {
              type: 'number',
              defaultValue: 3
            }
          },
          opcode: "turn_cw",
          text: "turn motors this way for [DURATION] seconds",
        },

        {
          blockType: BlockTypes.Command,
          arguments: {
            DURATION: {
              type: 'number',
              defaultValue: 3
            }
          },
          opcode: "turn_ccw",
          text: "turn motors that way for [DURATION] seconds",
        },
        {
          blockType: BlockTypes.Command,
          arguments: {
          },
          opcode: "print",
          text: "debug print",
        },
      ],
    };
  }

  public any_see_color(args, _blockUtils): boolean {
    const lookingFor = this.colorNameToLWPColorCode(args["COLOR"])
    const colorSensors = this.getAttachedColorSensors()
    const seeingColor = colorSensors.filter(it => it.value === lookingFor)


    return seeingColor.length >= 1
  }

  public most_see_color(args, _blockUtils): boolean {
    const lookingFor = this.colorNameToLWPColorCode(args["COLOR"])
    const colorSensors = this.getAttachedColorSensors()
    const seeingColor = colorSensors.filter(it => it.value === lookingFor)

    return seeingColor.length >= colorSensors.length / 2
  }

  public all_see_color(args, _blockUtils): boolean {
    const lookingFor = this.colorNameToLWPColorCode(args["COLOR"])
    const colorSensors = this.getAttachedColorSensors()
    const seeingColor = colorSensors.filter(it => it.value === lookingFor)

    return seeingColor.length === colorSensors.length
  }

  public any_pressed(args, _blockUtils): boolean {

    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length >= 1
    } else {
      return released.length >= 1
    }
  }

  public most_pressed(args, _blockUtils): boolean {
    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length >= forceSensors.length / 2
    } else {
      return released.length >= forceSensors.length / 2
    }
  }

  public all_pressed(args, _blockUtils): boolean {
    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length === forceSensors.length
    } else {
      return released.length === forceSensors.length
    }
  }

  public turn_cw(args, _blockUtils): Promise<void> {
    this.sendVmCommand({ command: "turn_cw_for_time", duration: args["DURATION"] })

    // Resolve any pending motor promise, this is a interrupt
    //@ts-ignore
    if (window.motorPromiseResolver !== undefined && window.motorPromiseResolver !== null) {
      //@ts-ignore
      window.motorPromiseResolver()
    }

    const p = new Promise<void>((resolve) => {
      //@ts-ignore
      window.motorPromiseResolver = resolve
    })

    return p
  }

  public turn_ccw(args, _blockUtils): Promise<void> {
    this.sendVmCommand({ command: "turn_ccw_for_time", duration: args["DURATION"] })

    // Resolve any pending motor promise, this is a interrupt
    //@ts-ignore
    if (window.motorPromiseResolver !== undefined && window.motorPromiseResolver !== null) {
      //@ts-ignore
      window.motorPromiseResolver()
    }

    const p = new Promise<void>((resolve) => {
      //@ts-ignore
      window.motorPromiseResolver = resolve
    })

    return p
  }

  public print(_args, _blockUtils): void {
    console.log("Ran block")
  }

  private getAttachedSensors() {
    //@ts-ignore
    const connectedPorts = Array.from(window.robots.values()).flatMap(it => it.ports)
    const attachedSensors = connectedPorts.map(it => it.attachment).filter(it => it !== 'none')

    return attachedSensors
  }

  private getAttachedForceSensors() {
    const attachedForceSensors = this.getAttachedSensors().filter(it => it.type === 'force_sensor')

    return attachedForceSensors
  }

  private getAttachedColorSensors() {
    const attachedColorSensors = this.getAttachedSensors().filter(it => it.type === 'color_sensor')

    return attachedColorSensors
  }

  private colorNameToLWPColorCode(colorName: string) {
    switch (colorName) {
      case 'Red':
        return 9

      case 'Green':
        return 5

      case 'Blue':
        return 3

      default:
        return -1
    }
  }
}

export { MyExtension };
