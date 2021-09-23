import { Box, Button, Flex, Link, Spinner, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { initializeApollo } from "../lib/apolloClient";
import { useCheckAuth } from "../utils/useCheckAuth";

const Login = () => {
  const router = useRouter();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: LoginInput = {
    usernameOrEmail: "",
    password: "",
  };
  const [LoginUser, { loading: _loginUserLoading, error }] = useLoginMutation();
  const toast = useToast();

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await LoginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        console.log("data login", data);
        // const meData = cache.readQuery({ query: MeDocument });
        // console.log("me data", meData);
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });

    if (response.data?.login?.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data?.login?.user) {
      toast({
        title: "Welcome.",
        description: `${response.data.login.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const apolloClient = initializeApollo();
      apolloClient.resetStore();
      // Login successfully
      router.push("/");
    }
  };
  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent="center" align="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper size="small">
          {error && <p>Failed to Login. Interval server error</p>}

          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="Username Or Email"
                  label="Username Or Email"
                  type="text"
                />
                <Box mt={4} mb={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Flex>
                  <NextLink href="/forgot-password">
                    <Link ml="auto">Forgot Password</Link>
                  </NextLink>
                </Flex>
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
      )}
    </>
  );
};

export default Login;
