import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fileUploadCss } from '../Auth/Register';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProfile,
  updateProfilePicture,
} from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';
import { toast } from 'react-hot-toast';

const Profile = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    message,
    error,
  } = useSelector(state => state.profile);

  const {
    loading: deleteLoading,
    message: deleteMessage,
    error: deleteError,
  } = useSelector(state => state.user);

  const changeImageSubmitHandler = async (e, image) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.append('file', image);

    await dispatch(updateProfilePicture(myForm));
    dispatch(loadUser());
  };

  const handleDeleteProfile = () => {
    dispatch(deleteProfile());
    setFlag(!flag)
    navigate('/login');
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    if (deleteMessage) {
      toast.success(deleteMessage);
      dispatch({ type: 'clearMessage' });
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch({ type: 'clearError' });
    }
  }, [dispatch, error, message, deleteMessage, deleteError,flag]);

  return (
    <Container minH={'95vh'} maxW="container.lg" py={'8'}>
      <Heading m={'8'} textTransform="uppercase">
        Profile
      </Heading>

      <Stack
        justifyContent={'flex-start'}
        direction={['column', 'row']}
        alignItems="center"
        spacing={['8', '16']}
        padding="8"
      >
        <VStack>
          <Avatar boxSize={'48'} src={user.avatar.url} />

          <Button colorScheme={'yellow'} variant={'ghost'} onClick={onOpen}>
            Change Photo
          </Button>
        </VStack>

        <VStack spacing={'4'} alignItems={['center', 'flex-start']}>
          <HStack>
            <Text children="Name" fontWeight={'bold'} />
            <Text children={user.name} />
          </HStack>

          <HStack>
            <Text children="Email" fontWeight={'bold'} />
            <Text children={user.email} />
          </HStack>

          <HStack>
            <Text children="Created At" fontWeight={'bold'} />
            <Text children={user.createdAt.split('T')[0]} />
          </HStack>

          <HStack>
            <Button onClick={handleDeleteProfile} isLoading={deleteLoading}>Delete Profile</Button>
          </HStack>

          <Stack direction={['column', 'row']} alignItems="center">
            <Link to="/updateprofile">
              <Button>Update Profile</Button>
            </Link>

            <Link to="/changepassword">
              <Button>Change Password</Button>
            </Link>
          </Stack>
        </VStack>
      </Stack>
      <ChangePhotoBox
        isOpen={isOpen}
        onClose={onClose}
        changeImageSubmitHandler={changeImageSubmitHandler}
        loading={loading}
      />
    </Container>
  );
};

export default Profile;

function ChangePhotoBox({
  isOpen,
  onClose,
  changeImageSubmitHandler,
  loading,
}) {
  const [image, setImage] = useState('');
  const [imagePrev, setImagePrev] = useState('');

  const changeImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const closeHandler = () => {
    onClose();
    setImagePrev('');
    setImage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <ModalOverlay backdropFilter={'blur(5px)'} />
      <ModalContent>
        <ModalHeader>Change Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form onSubmit={e => changeImageSubmitHandler(e, image)}>
              <VStack spacing={'8'}>
                {imagePrev && <Avatar src={imagePrev} boxSize={'48'} />}
                <Input
                  type="file"
                  css={{ '&::file-selector-button': fileUploadCss }}
                  onChange={changeImage}
                />
                <Button
                  isLoading={loading}
                  w={'full'}
                  colorScheme="yellow"
                  type="submit"
                >
                  Confirm Change
                </Button>
              </VStack>
            </form>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button mr={'3'} onClick={closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
