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
import AddWorkModal from "./Work/AddWorkModal";
import EditWorkModal from "./Work/EditWorkModal";

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
  const [categoryData, setCategoryData] = useState();

  // Work states
  const [openAddWorkModal, setOpenAddWorkModal] = useState(false);
  const [workData, setWorkData] = useState();
  const [catAddWork, setCatAddWork] = useState();
  const [openEditWorkModal, setOpenEditWorkModal] = useState(false);
  const [editWorkData, setEditWorkData] = useState();
  const [openDeleteWorkModal, setOpenDeleteWorkModal] = useState(false);
  const [deleteWork, setDeleteWork] = useState();

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
    openAddWorkModal,
    openEditWorkModal,
    openDeleteWorkModal,
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
  const handleDeleteCategory = async () => {
    const result = await api(
      "delete",
      `/BookLibraries/delete/Category/${deleteCategory}`
    );
    toast.success(result.data.message);
    handleDeleteCategoryModal();
  };

  //   func to delete Work
  const handleDeleteWork = async () => {
    const result = await api(
      "delete",
      `/BookLibraries/delete/Work/${deleteWork}`
    );
    toast.success(result.data.message);
    handleOpenDeleteWorkModal();
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
      let temp = librariesData.find((item) => {
        return item._id === id;
      }).categories;
      setCategoryData(temp);
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

  //   handle Categories open/close modal
  const handleOpenAddWorkModal = (id) => {
    if (id) {
      setCatAddWork(id);
      let temp = [];
      librariesData.map((item) => {
        item.works.map((work) => {
          if (work.category === id) {
            temp.push(work);
          }
        });
      });
      setWorkData(temp);
    }
    setOpenAddWorkModal(!openAddWorkModal);
  };

  const handleOpenEditWorkModal = (work) => {
    if (work) {
      setEditWorkData(work);
    }
    setOpenEditWorkModal(!openEditWorkModal);
  };

  const handleOpenDeleteWorkModal = (id) => {
    if (id) {
      setDeleteWork(id);
    }
    setOpenDeleteWorkModal(!openDeleteWorkModal);
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
            categoryData={categoryData}
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
            handleDelete={handleDeleteCategory}
          />
        }
      />
      {/* Work modals */}
      <Modal
        title="Add Work"
        open={openAddWorkModal}
        onClose={handleOpenAddWorkModal}
        component={
          <AddWorkModal
            category={catAddWork}
            workData={workData}
            handleOpenAddWorkModal={handleOpenAddWorkModal}
          />
        }
      />
      <Modal
        title="Edit Work"
        open={openEditWorkModal}
        onClose={handleOpenEditWorkModal}
        component={
          <EditWorkModal
            handleOpenEditWorkModal={handleOpenEditWorkModal}
            work={editWorkData}
          />
        }
      />
      <Modal
        title="Delete Work"
        open={openDeleteWorkModal}
        onClose={handleOpenDeleteWorkModal}
        component={
          <DeleteModal
            handleCancel={handleOpenDeleteWorkModal}
            handleDelete={handleDeleteWork}
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
          handleOpenAddWorkModal={handleOpenAddWorkModal}
          handleOpenEditWorkModal={handleOpenEditWorkModal}
          handleOpenDeleteWorkModal={handleOpenDeleteWorkModal}
          level1={librariesData}
        />
      </div>
    </div>
  );
};

export default Index;
