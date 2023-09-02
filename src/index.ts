// Load scratch blocks
import ScratchBlocks from "scratch-blocks"; // Will default to Vertical scratch
// Load VM
import ScratchVM from "scratch-vm";

import { projectData } from "./project-data";
import { ToolboxHelper } from "./toolbox-helper";
import { MyExtension } from "./my-extension";

export const startScratch = (onChangeCallback, workspaceEventChannel, sendVmCommand) => {
  // Clear toolbox: If we don't clear the toolbox the default toolbox will show up.
  const toolboxHelper = new ToolboxHelper(true);
  ScratchBlocks.Blocks.defaultToolbox = toolboxHelper.buildToolbox();

  // // Setup workspace
  const workspace = ScratchBlocks.inject("blocklyDiv", {
    media: "/scratch-media/", // WebPack copies the necessary files from node_modules/scratch-blocks/media
    readOnly: false,
    scrollbars: true,
    horizontalLayout: false,
    sounds: false,
    grid: { spacing: 16, length: 2, colour: "#EAEDED", snap: false },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.75,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1,
    },
    colours: {
      fieldShadow: "rgba(255, 255, 255, 0.3)",
      dragShadowOpacity: 0.6,
    },
  });



  workspaceEventChannel.on("workspace_update", payload => {

    if (!payload.workspace_id) {
      return
    }
    if (payload.workspace_id === workspace.id) {
      return
    } else {
      const updatedProject = projectData()
      updatedProject.targets[1].blocks = payload.blocks

      loadProject(updatedProject)
    }
  });

  const vm = new ScratchVM(); // Create a new Scratch vm.

  window.addEventListener("phx:selected_leader", () => {
    vm.start()
  })

  const changeListenerFunction = (update) => {
    vm.blockListener(update)

    if (["ui", "endDrag"].includes(update.type)) {
      return
    }
    // There are different types of updates, and we can safely ignore some of those
    // see here: https://github.com/scratchfoundation/scratch-vm/blob/develop/src/engine/blocks.js#L319
    // We want
    // - create
    // - change
    // - move
    // - delete
    // Ignore comments and var's for now

    const blocksAfterUpdate = JSON.parse(vm.toJSON()).targets[1].blocks
    const projectAfterUpdate = projectData()
    projectAfterUpdate.targets[1].blocks = blocksAfterUpdate

    onChangeCallback({ blocks: blocksAfterUpdate, workspace_id: workspace.id })
  }

  // Setup Extension listener
  // Once we've added out extension we need to tell Scratch-blocks
  // that we have some new blocks. So we subscribe to the "EXTENSION_ADDED" event and
  // add our new blocks and menus

  vm.addListener("EXTENSION_ADDED", (extensionInfo) => {
    const array = [];
    extensionInfo.blocks.forEach((blockInfo) => {
      array.push(blockInfo.json);
    });
    extensionInfo.menus.forEach((menuInfo) => {
      array.push(menuInfo.json);
    });
    ScratchBlocks.defineBlocksWithJsonArray(array);

    // New blocks have been added, so its time to refresh the toolbox.
    toolboxHelper.addExtension(extensionInfo);
    const toolbox = toolboxHelper.buildToolbox();
    workspace.updateToolbox(toolbox);
  });

  // Load extension. Using _registerInternalExtension we avoid the sandboxing that
  // otherwise happens to extensions.
  const extension = new MyExtension(sendVmCommand);
  const serviceName = vm.extensionManager._registerInternalExtension(extension);
  vm.extensionManager._loadedExtensions.set(extension.getInfo().id, serviceName);

  // Handle project loads
  workspace.addChangeListener(changeListenerFunction)
  vm.addListener("workspaceUpdate", (update) => {
    const dom = ScratchBlocks.Xml.textToDom(update.xml);
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
  });

  const loadProject = (project) => {

    ScratchBlocks.Events.disable()
    vm.loadProject(project).then(() => {
      ScratchBlocks.Events.enable()
    })
  }

  loadProject(projectData())
}


