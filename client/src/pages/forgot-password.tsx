import { Button } from "@chakra-ui/button";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";
import NextLink from "next/link";
const ForgotPassword = () => {
  const initialValues = { email: "" };
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();
  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
  };
  if (authLoading || (!authLoading && authData?.me)) {
    return (
      <Flex justifyContent="center" align="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else {
    return (
      <Wrapper>
        <Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
          {({ isSubmitting }) =>
            !loading && data ? (
              <Box>Please check your inbox</Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                />
                <Flex>
                  <NextLink href="/login">
                    <Link ml="auto">Back to Login</Link>
                  </NextLink>
                </Flex>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Send Reset Password Email
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
  }
};

export default ForgotPassword;
