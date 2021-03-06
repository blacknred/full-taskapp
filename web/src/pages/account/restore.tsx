import { Button, Center, Heading, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Input from '../../components/Form/Input';
import Layout from '../../components/Layout';
import { MESSAGES } from '../../config';
import mutations from '../../lib/mutations';

function RestoreAccount() {
  const router = useRouter();

  return (
    <Layout variant="sm" slide={false}>
      <Formik
        initialValues={{ password: "", password2: "", token: router.query.token }}
        onSubmit={({ token, password, password2 }, actions) => {
          if (password2 !== password) {
            actions.setErrors({ password2: 'Passwords differ' });
            actions.setSubmitting(false);
            return;
          }

          mutations.restoreUser({ password, token }, (err) => {
            if (err) {
              actions.setErrors(err);
              actions.setSubmitting(false)
            } else {
              router.push(`/account#${MESSAGES['restore-account-done']}`)
            }
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing="9">
              <Center><Heading fontSize="x-large">Set new password</Heading></Center>

              <Stack spacing="4">
                <Input name="token" hidden />
                <Input name="password" label="Password" type="password" />
                <Input name="password2" label="Repeat password" type="password" placeholder="password" />
              </Stack>

              <Button size="lg" colorScheme="messenger" isLoading={isSubmitting}
                type="submit" isFullWidth>Save</Button>

              <NextLink href="/account">
                <Button variant="unstyled">Back to authentication</Button>
              </NextLink>
            </Stack>
          </Form>
        )}
      </Formik>
    </Layout >
  );
}

export default RestoreAccount;
