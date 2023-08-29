import { ExtensionDefinition, BlockTypes } from "./models";
/*
 * Simple example extension.
 * You can find more information here: https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md
 */
class MyExtension {
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
              type: 'number'
            }
          },
          opcode: "turn_cw",
          text: "turn motors this way for [DURATION] seconds",
        },

        {
          blockType: BlockTypes.Command,
          arguments: {
            DURATION: {
              type: 'number'
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
    // console.log("Args:", args["COLOR"]);
    return false
  }

  public most_see_color(args, _blockUtils): boolean {
    return false
  }

  public all_see_color(args, _blockUtils): boolean {
    return false
  }

  public any_pressed(args, _blockUtils): boolean {

    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length >= 1
    } else {
      console.log("any relased?", released.length >= 1
      )
      released.length >= 1
    }
  }

  public most_pressed(args, blockUtils): boolean {
    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length >= forceSensors.length / 2
    } else {
      released.length >= forceSensors.length / 2
    }
  }

  public all_pressed(args, blockUtils): boolean {
    const forceSensors = this.getAttachedForceSensors()
    const pressed = forceSensors.filter(it => it.value > 0)
    const released = forceSensors.filter(it => it.value === 0)

    if (args["PRESSED"] === 'Pressed') {
      return pressed.length === forceSensors.length
    } else {
      released.length === forceSensors.length
    }
  }

  public turn_cw(args, blockUtils): void {
    // console.log("Args:", args["DURATION"]);
  }

  public turn_ccw(args, blockUtils): void {
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
}

export { MyExtension };
