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
}

interface Actions {
  setParameters: (values: ParameterState) => void;
}

export const useParameterStore = create<ParameterState & Actions>((set) => ({
  stc: 3800,
  ptc: 3000,
  v_mp: 30,
  i_mp: 10,
  v_oc: 40,
  i_sc: 12,
  alpha_sc: 0.003,
  beta_oc: -0.3,
  gamma_r: -0.4,
  n_s: 12,
  temp_ref: 25,
  setParameters: (values) => set(values),
}));
