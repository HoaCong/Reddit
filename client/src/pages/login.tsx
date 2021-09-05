import { Box, Button } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { LoginInput, useLoginMutation } from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";

const Login = () => {
  const router = useRouter();
  const initialValues: LoginInput = {
    usernameOrEmail: "",
    password: "",
  };
  const [LoginUser, { loading: _loginUserLoading, data, error }] =
    useLoginMutation();

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await LoginUser({
      variables: {
        loginInput: values,
      },
    });

    if (response.data?.login?.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data?.login?.user) {
      // Login successfully
      router.push("/");
    }
  };
  return (
    <Wrapper>
      {error && <p>Failed to Login. Interval server error</p>}
      {data && data.login?.success && (
        <p>Logined successfully {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username Or Email"
              label="Username Or Email"
              type="text"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
