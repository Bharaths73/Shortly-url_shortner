export const queryDefaults = {
    staleTime: 60_000,
    gcTime: 5*60_000,
    retry: (failureCount, error) => {
      if(error?.code === "ERR_CANCELED"){
        return false;
      }
      const status = error?.response?.status;
      if(status>=400 && status<500){
        return false;
      }
      return failureCount<2;
    },
    retryDelay: (attemptIndex) => Math.min(1000*2**attemptIndex, 10_000),
    refetchOnWindowFocus: false,
}