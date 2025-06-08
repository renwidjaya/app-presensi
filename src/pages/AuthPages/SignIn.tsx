import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login"
        description="This is Login Page"
      />
      <SignInForm />
    </>
  );
}
