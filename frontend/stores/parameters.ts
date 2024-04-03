"use client";

import { create } from "zustand";

interface ParameterState {
  name: string;
  stc: number;
  ptc: number;
  v_mp: number;
  i_mp: number;
  v_oc: number;
  i_sc: number;
  alpha_sc: number;
  beta_oc: number;
  gamma_r: number;
  n_s: number;
  temp_ref: number;
  length: number;
  width: number;
}

interface Actions {
  setParameters: (values: ParameterState) => void;
}

export const useParameterStore = create<ParameterState & Actions>((set) => ({
  name: "BYD395MLK-27",
  // stc: 385,
  // ptc: 288.3,
  // v_mp: 40.24,
  // i_mp: 9.57,
  // v_oc: 48.17,
  // i_sc: 10.05,
  // alpha_sc: 0.04,
  // beta_oc: -0.27,
  // gamma_r: -0.35,
  stc: 395,
  ptc: 294.8,
  v_mp: 30.32,
  i_mp: 13.03,
  v_oc: 36.9,
  i_sc: 13.71,
  alpha_sc: 0.042,
  beta_oc: -0.254,
  gamma_r: -0.328,
  n_s: 108,
  temp_ref: 25,
  length: 1.722,
  width: 1.134,
  setParameters: (values) => set(values),
}));
