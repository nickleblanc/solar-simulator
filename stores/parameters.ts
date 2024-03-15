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
  stc: 600,
  ptc: 454,
  v_mp: 44,
  i_mp: 13.64,
  v_oc: 51.8,
  i_sc: 14.54,
  alpha_sc: 0.05,
  beta_oc: -0.25,
  gamma_r: -0.29,
  n_s: 144,
  temp_ref: 25,
  length: 2,
  width: 1,
  setParameters: (values) => set(values),
}));
