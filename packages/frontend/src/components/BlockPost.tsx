import { Box, Container, Image, Text } from '@chakra-ui/react'

const postData = {
  img: 'https://via.placeholder.com/150',
  title: 'Title',
  content: 'Content',
  gated: false,
}

const userData = {
  name: 'IDK',
  date: '2022-09-02',
}

const BlogPost = () => {
  const { img, title, content, gated } = postData
  const { name, date } = userData

  if (gated) {
    // return <Error statusCode={404} />
    return <>error page</>
  }

  return (
    <Container marginTop={'110px'} centerContent maxW="container.lg">
      <Box>
        <Image src={img} alt={title} width={250} height={250} />
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <Text>{content}</Text>
        <Box mt="4">
          <Text fontSize="sm" color="gray.500">
            Posted by {name} on {date}
          </Text>
        </Box>
      </Box>
    </Container>
  )
}

export default BlogPost
