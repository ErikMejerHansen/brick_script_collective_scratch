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
          opcode: "most_see",
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
          text: "turn motors that way for [DURATION] seconds",
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
      ],
    };
  }
  public always(_args, _blockUtils): boolean {
    return true;
  }

  public print(args, blockUtils): void {
    console.log("Print block activated");
    console.log("Args:", args);
    console.log("blockUtils:", blockUtils);
  }
}

export { MyExtension };
