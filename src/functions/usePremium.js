export default function usePremium() {
  const status = { premium: true, plan: { id: "premium", name: "Premium" } };
  const done = async () => status;
  return { loading: false, premium: true, status, error: null, refresh: done, refreshFromStripe: done };
}
