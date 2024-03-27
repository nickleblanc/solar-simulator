"use client";

import { create } from "zustand";

interface ParameterState {
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
  stc: 385,
  ptc: 288.3,
  v_mp: 40.24,
  i_mp: 9.57,
  v_oc: 49.57,
  i_sc: 10.05,
  alpha_sc: 0.04,
  beta_oc: -0.27,
  gamma_r: -0.35,
  n_s: 144,
  temp_ref: 25,
  length: 2,
  width: 1,
  setParameters: (values) => set(values),
}));
