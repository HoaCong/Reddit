import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  ChangePasswordInput,
  useChangePasswordMutation,
} from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { useCheckAuth } from "../utils/useCheckAuth";
const ChangePassword = () => {
  const { query } = useRouter();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const initialValues = { newPassword: "" };
  const [errorToken, setErrorToken] = React.useState("");
  const [changePassword, { loading }] = useChangePasswordMutation();
  const onChangePasswordSubmit = async (
    values: ChangePasswordInput,
    { setErrors }: FormikHelpers<ChangePasswordInput>
  ) => {
    if (query.userId && query.token) {
      const response = await changePassword({
        variables: {
          userId: query.userId as string,
          token: query.token as string,
          changePasswordInput: values,
        },
      });
      if (response.data?.changePassword.errors) {
        const fieldErrors = mapFieldErrors(response.data.changePassword.errors);
        if ("token" in fieldErrors) {
          setErrorToken(fieldErrors.token);
        }
        setErrors(fieldErrors);
      }
    }
  };
  if (authLoading || (!authLoading && authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else if (!query.token || !query.userId)
    return (
      <Wrapper>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Invalid password change request</AlertTitle>
        </Alert>

        <Flex mt={2}>
          <NextLink href="/login">
            <Link ml="auto">Back to Login</Link>
          </NextLink>
        </Flex>
      </Wrapper>
    );
  else {
    return (
      <Wrapper>
        <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
              {errorToken && (
                <Flex flexDirection="column">
                  <Box color="red" mb={2}>
                    {errorToken}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>Go back forgot password</Link>
                  </NextLink>
                </Flex>
              )}
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  }
};

export default ChangePassword;
