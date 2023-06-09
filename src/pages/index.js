import Head from 'next/head';
import {
  Container,
  Heading,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import {
  useFetchProducts,
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
} from '@/features/product';

export default function Home() {
  const toast = useToast();

  const {
    data: products,
    isLoading: productsIsLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: () => {
      toast({
        title: 'Error: Something went wrong',
        status: 'error',
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      image: '',
      id: '',
    },
    onSubmit: () => {
      console.log('Form submitted');
      const { name, price, description, image, id } = formik.values;

      if (id) {
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        });

        toast({
          title: 'Product edited',
          status: 'success',
        });
      } else {
        mutate({
          name,
          price: parseInt(price),
          description,
          image,
        });

        toast({
          title: 'Product added',
          status: 'success',
        });
      }

      formik.setFieldValue('name', '');
      formik.setFieldValue('price', '');
      formik.setFieldValue('description', '');
      formik.setFieldValue('image', '');
      formik.setFieldValue('id', '');
    },
  });

  const { mutate, isLoading: createProductIsLoading } = useCreateProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: editProduct, isLoading: editProductIsLoading } =
    useEditProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  const handleForm = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const deleteConfirmation = (productId) => {
    const shouldDelete = confirm('Are you sure?');

    if (shouldDelete) {
      deleteProduct(productId);
    }

    toast({
      title: 'Product deleted',
      status: 'info',
    });
  };

  const onEditClick = (product) => {
    formik.setFieldValue('id', product.id);
    formik.setFieldValue('name', product.name);
    formik.setFieldValue('price', product.price);
    formik.setFieldValue('description', product.description);
    formik.setFieldValue('image', product.image);
  };

  const renderProduct = () => {
    return products?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.name}</Td>
          <Td>{product.price}</Td>
          <Td>{product.description}</Td>
          <Td>{product.image}</Td>
          <Td>
            <Button onClick={() => onEditClick(product)} colorScheme='cyan'>
              Edit
            </Button>
          </Td>
          <Td>
            <Button
              onClick={() => deleteConfirmation(product.id)}
              colorScheme='red'
            >
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container>
        <Heading>Hello World</Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Description</Th>
              <Th>Image</Th>
              <Th colSpan={2}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {renderProduct()}
            {productsIsLoading && <Spinner />}
          </Tbody>
        </Table>

        <form onSubmit={formik.handleSubmit}>
          <VStack>
            <FormControl>
              <FormLabel>Product ID</FormLabel>
              <Input
                onChange={handleForm}
                name='id'
                value={formik.values.id}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                onChange={handleForm}
                name='name'
                value={formik.values.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                onChange={handleForm}
                name='price'
                value={formik.values.price}
              />
              {/* 
              <NumberInput>
                <NumberInputField
                  onChange={handleForm}
                  name='price'
                  value={formik.values.price}
                />
              </NumberInput> */}
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                onChange={handleForm}
                name='description'
                value={formik.values.description}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                onChange={handleForm}
                name='image'
                value={formik.values.image}
              />
            </FormControl>
            {createProductIsLoading || editProductIsLoading ? (
              <Spinner />
            ) : (
              <Button type='submit'>Submit</Button>
            )}
          </VStack>
        </form>
      </Container>
    </>
  );
}
