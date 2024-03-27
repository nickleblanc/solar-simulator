import { z } from "zod";

const invalid_type_error = "Value must be a number";

export const LocationFormSchema = z.object({
  latitude: z.coerce.number().gte(-90).lte(90),
  longitude: z.coerce.number().gte(-180).lte(180),
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
});

export const PanelFormSchema = z.object({
  stc: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  ptc: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  v_mp: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  i_mp: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  v_oc: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  i_sc: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  alpha_sc: z.coerce.number({ invalid_type_error }),
  beta_oc: z.coerce.number({ invalid_type_error }),
  gamma_r: z.coerce.number({ invalid_type_error }),
  n_s: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  temp_ref: z.coerce
    .number({ invalid_type_error })
    .gte(-50, "Reference temperature must be between -50 and 50")
    .lte(50, "Reference temperature must be between -50 and 50"),
  length: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
  width: z.coerce
    .number({ invalid_type_error })
    .positive("Value must be positive"),
});
