// Without a defined matcher, this one line applies next-auth to the enter project
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/pages/dashboard)"] // Exclude the '/' route from next-auth
};
