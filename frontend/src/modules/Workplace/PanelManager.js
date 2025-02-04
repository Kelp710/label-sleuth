/*
    Copyright (c) 2022 IBM Corp.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { RIGHT_DRAWER_WIDTH, panelIds } from "../../const";
import MainPanel from "./main/MainPanel";
import { useSelector } from "react-redux";

import AllPositiveLabelsPanel from "./sidebar/AllPositiveLabelsPanel";
import SuspiciousLabelsPanel from "./sidebar/SuspiciousLabelsPanel";
import ContradictingLabelsPanel from "./sidebar/ContradictingLabelsPanel";
import EvaluationPanel from "./sidebar/EvaluationPanel";
import SearchPanel from "./sidebar/SearchPanel";
import LabelNextPanel from "./sidebar/LabelNextPanel";
import PosPredictionsPanel from "./sidebar/PosPredictionsPanel";

import useTogglePanel from "./sidebar/customHooks/useTogglePanel";

import { useUpdateSearch } from "./sidebar/customHooks/useUpdateSearch";

/**
 * Manages the panels, that is, the sidebar panels and the main panels.
 */
export const PanelManager = ({ handleKeyEvent }) => {
  const activePanelId = useSelector(
    (state) => state.workspace.panels.activePanelId
  );

  const [open, setOpen] = useState(false);
  const textInputRef = useRef(null);

  useTogglePanel(setOpen, textInputRef);
  
  /**
   * this custom hook is used here instead of in the Search sidebar panel
   * because that panel gets unmounted when another sidebar panel gets selected
   * and that makes useEffects hooks to be re-run each time it gets re-rendered
   */
  const clearSearchInput = useUpdateSearch(textInputRef)    

  return (
    <Box>
      <MainPanel handleKeyEvent={handleKeyEvent} open={open} />
      <Drawer
        sx={{
          width: RIGHT_DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: RIGHT_DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        PaperProps={{
          sx: { backgroundColor: "#f8f9fa !important", right: 50 },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {activePanelId === panelIds.SEARCH && <SearchPanel clearSearchInput={clearSearchInput} ref={textInputRef} />}
        {activePanelId === panelIds.LABEL_NEXT && <LabelNextPanel />}
        {activePanelId === panelIds.POSITIVE_PREDICTIONS && (<PosPredictionsPanel />)}
        {activePanelId === panelIds.POSITIVE_LABELS && <AllPositiveLabelsPanel />}
        {activePanelId === panelIds.SUSPICIOUS_LABELS && (<SuspiciousLabelsPanel />)}
        {activePanelId === panelIds.CONTRADICTING_LABELS && ( <ContradictingLabelsPanel />)}
        {activePanelId === panelIds.EVALUATION && <EvaluationPanel />}
      </Drawer>
    </Box>
  );
};
