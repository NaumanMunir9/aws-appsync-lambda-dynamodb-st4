type AppSyncEvent = {
  info: {
    filedName: String;
  };
};

export async function handler(event: AppSyncEvent) {
  if (event.info.filedName == "welcome") {
    return `Hello World!`;
  } else {
    return `Not Found!`;
  }
}
