const LogVariantColorMap = {
  info: "\x1b[34m", // blue
  error: "\x1b[31m", // red
  success: "\x1b[32m", // green
};

type LogVariant = keyof typeof LogVariantColorMap;

export const log = (message: string, variant: LogVariant = "info") => {
  console.log(`${LogVariantColorMap[variant]}%s\x1b[0m`, message);
};
