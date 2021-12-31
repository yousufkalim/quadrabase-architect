// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/projectLibraries";
import { Store } from "../../StoreContext";
import api from "../../api";

// Importing Components
import Header from "../../components/Header";
import NestedList from "../../components/NestedList";
import Modal from "../../components/Modal";
import AddFamilyModal from "./Families/AddFamilyModal";
import AddLibraryModal from "./Libraries/AddLibraryModal";
import EditLibraryModal from "./Libraries/EditLibraryModal";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";
import AddCategoryModal from "./Categories/AddCategoryModal";
import EditCategoryModal from "./Categories/EditCategoryModal";

// component
const Index = () => {
  const classes = useStyles();
  const store = Store();
  //   families states
  const [openFamiliesModal, setOpenFamiliesModal] = useState(false);

  // libraries states
  const [librariesData, setLibrariesData] = useState(false);
  const [openLibrariesModal, setOpenLibrariesModal] = useState(false);
  const [openEditLibrariesModal, setOpenEditLibrariesModal] = useState(false);
  const [editLibrariesData, setEditLibrariesData] = useState();
  const [deleteLibraryModal, setDeleteLibraryModal] = useState(false);
  const [deleteLibrary, setDeleteLibrary] = useState();

  // Categories states
  const [openAddCatgeoryModal, setOpenAddCatgeoryModal] = useState(false);
  const [libAddCategory, setLibAddCategory] = useState();
  const [openEditCatgeoryModal, setOpenEditCatgeoryModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState();
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState();

  //   useEffect to get all libraries of current user
  useEffect(() => {
    getLibraries();
  }, [
    store.user,
    openLibrariesModal,
    openEditLibrariesModal,
    deleteLibraryModal,
    openAddCatgeoryModal,
    openEditCatgeoryModal,
    deleteCategoryModal,
  ]);

  //   func to get all libraries
  const getLibraries = async () => {
    const result =
      store?.user?._id &&
      (await api("get", `/BookLibraries/getByArchitectId/${store.user._id}`));
    setLibrariesData(result?.data?.bookLibrary);
  };

  //   func to delete libraries
  const handleDeleteLibrary = async () => {
    const result = await api(
      "delete",
      `/BookLibraries/delete/${deleteLibrary}`
    );
    toast.success(result.data.message);
    handleDeleteLibraryModal();
  };

  //   func to delete Category
  const handleCategoryLibrary = async () => {
    const result = await api(
      "delete",
      `/BookLibraries/delete/Category/${deleteCategory}`
    );
    toast.success(result.data.message);
    handleDeleteCategoryModal();
  };

  //   handle families open/close modal
  const handleOpenFamiliesModal = () =>
    setOpenFamiliesModal(!openFamiliesModal);

  //   handle Libraries open/close modal
  const handleOpenLibrariesModal = () =>
    setOpenLibrariesModal(!openLibrariesModal);

  const handleOpenEditLibrariesModal = (library) => {
    if (library) {
      setEditLibrariesData(library);
    }
    setOpenEditLibrariesModal(!openEditLibrariesModal);
  };

  const handleDeleteLibraryModal = (id) => {
    if (id) {
      setDeleteLibrary(id);
    }
    setDeleteLibraryModal(!deleteLibraryModal);
  };

  //   handle Categories open/close modal
  const handleOpenAddCatgeoryModal = (id) => {
    if (id) {
      setLibAddCategory(id);
    }
    setOpenAddCatgeoryModal(!openAddCatgeoryModal);
  };

  const handleOpenEditCatgeoryModal = (category) => {
    if (category) {
      setEditCategoryData(category);
    }
    setOpenEditCatgeoryModal(!openEditCatgeoryModal);
  };

  const handleDeleteCategoryModal = (id) => {
    if (id) {
      setDeleteCategory(id);
    }
    setDeleteCategoryModal(!deleteCategoryModal);
  };

  // jsx
  return (
    <div>
      <Header />
      {/* families modal */}
      <Modal
        title="Manage Families"
        open={openFamiliesModal}
        onClose={handleOpenFamiliesModal}
        component={
          <AddFamilyModal handleOpenFamiliesModal={handleOpenFamiliesModal} />
        }
      />
      {/* Libararies modals */}
      <Modal
        title="Add Library"
        open={openLibrariesModal}
        onClose={handleOpenLibrariesModal}
        component={
          <AddLibraryModal
            handleOpenLibrariesModal={handleOpenLibrariesModal}
            librariesData={librariesData}
          />
        }
      />
      <Modal
        title="Edit Library"
        open={openEditLibrariesModal}
        onClose={handleOpenEditLibrariesModal}
        component={
          <EditLibraryModal
            library={editLibrariesData}
            handleOpenEditLibrariesModal={handleOpenEditLibrariesModal}
          />
        }
      />
      <Modal
        open={deleteLibraryModal}
        onClose={handleDeleteLibraryModal}
        component={
          <DeleteModal
            handleCancel={handleDeleteLibraryModal}
            handleDelete={handleDeleteLibrary}
          />
        }
      />
      {/* Category modals */}
      <Modal
        title="Add Category"
        open={openAddCatgeoryModal}
        onClose={handleOpenAddCatgeoryModal}
        component={
          <AddCategoryModal
            library={libAddCategory}
            handleOpenAddCatgeoryModal={handleOpenAddCatgeoryModal}
          />
        }
      />
      <Modal
        title="Edit Category"
        open={openEditCatgeoryModal}
        onClose={handleOpenEditCatgeoryModal}
        component={
          <EditCategoryModal
            handleOpenEditCatgeoryModal={handleOpenEditCatgeoryModal}
            category={editCategoryData}
          />
        }
      />
      <Modal
        open={deleteCategoryModal}
        onClose={handleDeleteCategoryModal}
        component={
          <DeleteModal
            handleCancel={handleDeleteCategoryModal}
            handleDelete={handleCategoryLibrary}
          />
        }
      />
      <div className={classes.container}>
        <NestedList
          label="Project Libraries"
          handleOpenFamiliesModal={handleOpenFamiliesModal}
          handleOpenLibrariesModal={handleOpenLibrariesModal}
          handleOpenEditLibrariesModal={handleOpenEditLibrariesModal}
          handleDeleteLibraryModal={handleDeleteLibraryModal}
          handleOpenAddCatgeoryModal={handleOpenAddCatgeoryModal}
          handleOpenEditCatgeoryModal={handleOpenEditCatgeoryModal}
          handleDeleteCategoryModal={handleDeleteCategoryModal}
          level1={librariesData}
        />
      </div>
    </div>
  );
};

export default Index;
