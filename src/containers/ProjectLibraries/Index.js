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
import AddWorkDetailsModal from "./WorkDetails/AddWorkDetailsModal";
import EditWorkDetailsModal from "./WorkDetails/EditWorkDetailsModal";

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

  // WorkDetails states
  const [openAddWorkDetailModal, setOpenAddWorkDetailModal] = useState(false);
  const [workDetailData, setWorkDetailData] = useState();
  const [workAddWorkDetail, setWorkAddWorkDetail] = useState();
  const [openEditWorkDetailModal, setOpenEditWorkDetailModal] = useState(false);
  const [editWorkDetailData, setEditWorkDetailData] = useState();
  const [openDeleteWorkDetailModal, setOpenDeleteWorkDetailModal] =
    useState(false);
  const [deleteWorkDetail, setDeleteWorkDetail] = useState();

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
    openAddWorkDetailModal,
    openEditWorkDetailModal,
    openDeleteWorkDetailModal,
  ]);

  //   func to get all libraries
  const getLibraries = async () => {
    const result =
      store?.user?._id &&
      (await api("get", `/BookLibraries/getByArchitectId/${store.user._id}`));
    let data = result?.data?.bookLibrary;
    data?.map((dt) => {
      dt.categories = dt.categories.sort((a, b) => a.ranking - b.ranking);
      dt.works = dt.works.sort((a, b) => a.ranking - b.ranking);
      dt.work_details = dt.work_details.sort((a, b) => a.ranking - b.ranking);
    });
    setLibrariesData(data);
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

  //   func to delete Work Details
  const handleDeleteWorkDetail = async () => {
    const result = await api(
      "delete",
      `/BookLibraries/delete/WorkDetail/${deleteWorkDetail}`
    );
    toast.success(result.data.message);
    handleOpenDeleteWorkDetailModal();
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
      })?.categories;
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

  //   handle Work open/close modal
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

  //   handle Work Details open/close modal
  const handleOpenAddWorkDetailModal = (id) => {
    if (id) {
      setWorkAddWorkDetail(id);
      let temp = [];
      librariesData.map((item) => {
        item.work_details.map((workdetail) => {
          if (workdetail.work === id) {
            temp.push(workdetail);
          }
        });
      });
      setWorkDetailData(temp);
    }
    setOpenAddWorkDetailModal(!openAddWorkDetailModal);
  };

  const handleOpenEditWorkDetailModal = (WorkDetail) => {
    if (WorkDetail) {
      setEditWorkDetailData(WorkDetail);
    }
    setOpenEditWorkDetailModal(!openEditWorkDetailModal);
  };

  const handleOpenDeleteWorkDetailModal = (id) => {
    if (id) {
      setDeleteWorkDetail(id);
    }
    setOpenDeleteWorkDetailModal(!openDeleteWorkDetailModal);
  };

  //LibraryUp
  const handleLibraryUp = async (id) => {
    // setIndex(id);
    let filteredIndex = librariesData.findIndex((dt) => dt._id == id);
    if (filteredIndex != 0) {
      let tempArr = [...librariesData];
      let prevIndex = filteredIndex - 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/update/${id}`, { ranking: prevIndex }).then(
        () => {
          api("put", `/BookLibraries/update/${prev._id}`, {
            ranking: filteredIndex,
          });
        }
      );
      tempArr[filteredIndex] = librariesData[filteredIndex - 1];
      tempArr[filteredIndex - 1] = librariesData[filteredIndex];
      setLibrariesData(tempArr);
    }
  };
  //Library Down
  const handleLibraryDown = async (id) => {
    // setIndex(id);
    let filteredIndex = librariesData.findIndex((dt) => dt._id == id);

    if (filteredIndex !== librariesData.length - 1) {
      let tempArr = [...librariesData];
      let nextIndex = filteredIndex + 1;
      let prev = tempArr[nextIndex];

      api("put", `/BookLibraries/update/${id}`, { ranking: nextIndex }).then(
        () => {
          api("put", `/BookLibraries/update/${prev._id}`, {
            ranking: filteredIndex,
          });
        }
      );
      tempArr[filteredIndex] = librariesData[nextIndex];
      tempArr[nextIndex] = librariesData[filteredIndex];
      setLibrariesData(tempArr);
    }
  };

  //categoryUp
  const handleCategoryUp = async (id, levelData) => {
    // setIndex(id);
    let categories = levelData.categories;
    let filteredIndex = categories.findIndex((dt) => dt._id == id);

    if (filteredIndex !== 0) {
      let tempArr = [...categories];
      let prevIndex = filteredIndex - 1;

      let prev = tempArr[prevIndex];
      console.log("prevIndex: ", categories);
      api("put", `/BookLibraries/update/editCategory/${id}`, {
        ranking: prevIndex,
      }).then((res) => {
        api("put", `/BookLibraries/update/editCategory/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
  };
  //categoryDown
  const handleCategoryDown = async (id, levelData) => {
    // setIndex(id);
    let categories = levelData.categories;
    let filteredIndex = categories.findIndex((dt) => dt._id == id);

    if (filteredIndex !== categories.length - 1) {
      let tempArr = [...categories];
      let prevIndex = filteredIndex + 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/update/editCategory/${id}`, {
        ranking: prevIndex,
      }).then(() => {
        api("put", `/BookLibraries/update/editCategory/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
  };

  //workUp
  const handleWorkUp = async (id, levelData) => {
    // setIndex(id);

    let works = levelData.works;
    let filteredIndex = works.findIndex((dt) => dt._id == id);

    if (filteredIndex !== 0) {
      let tempArr = [...works];
      let prevIndex = filteredIndex - 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/edit/Work/${id}`, {
        ranking: prevIndex,
      }).then(() => {
        api("put", `/BookLibraries/edit/Work/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
  };
  //workDown
  const handleWorkDown = async (id, levelData) => {
    // setIndex(id);
    let works = levelData.works;
    let filteredIndex = works.findIndex((dt) => dt._id == id);

    if (filteredIndex !== works.length - 1) {
      let tempArr = [...works];
      let prevIndex = filteredIndex + 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/edit/Work/${id}`, {
        ranking: prevIndex,
      }).then(() => {
        api("put", `/BookLibraries/edit/Work/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
  };

  //workdetailUp
  const handleWorkDetailUp = async (id, levelData) => {
    // setIndex(id);
    let work_details = levelData.work_details;
    let filteredIndex = work_details.findIndex((dt) => dt._id == id);

    if (filteredIndex !== 0) {
      let tempArr = [...work_details];
      let prevIndex = filteredIndex - 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/edit/WorkDetail/${id}`, {
        ranking: prevIndex,
      }).then(() => {
        api("put", `/BookLibraries/edit/WorkDetail/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
  };
  //workdetailDown
  const handleWorkDetailDown = async (id, levelData) => {
    // setIndex(id);
    let work_details = levelData.work_details;
    let filteredIndex = work_details.findIndex((dt) => dt._id == id);

    if (filteredIndex !== work_details.length - 1) {
      let tempArr = [...work_details];
      let prevIndex = filteredIndex + 1;

      let prev = tempArr[prevIndex];

      api("put", `/BookLibraries/edit/WorkDetail/${id}`, {
        ranking: prevIndex,
      }).then(() => {
        api("put", `/BookLibraries/edit/WorkDetail/${prev._id}`, {
          ranking: filteredIndex,
        }).then(() => getLibraries());
      });
    }
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
        component={<AddFamilyModal />}
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
      {console.log("openAddCatgeoryModal", openAddCatgeoryModal)}
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
        open={openDeleteWorkModal}
        onClose={handleOpenDeleteWorkModal}
        component={
          <DeleteModal
            handleCancel={handleOpenDeleteWorkModal}
            handleDelete={handleDeleteWork}
          />
        }
      />
      {/* Work Detail modals */}
      <Modal
        title="Add Work Detail"
        open={openAddWorkDetailModal}
        onClose={handleOpenAddWorkDetailModal}
        component={
          <AddWorkDetailsModal
            handleOpenAddWorkDetailModal={handleOpenAddWorkDetailModal}
            workDetailData={workDetailData}
            work={workAddWorkDetail}
          />
        }
      />
      <Modal
        title="Edit Work Detail"
        open={openEditWorkDetailModal}
        onClose={handleOpenEditWorkDetailModal}
        component={
          <EditWorkDetailsModal
            handleOpenEditWorkDetailModal={handleOpenEditWorkDetailModal}
            workDetail={editWorkDetailData}
          />
        }
      />
      <Modal
        open={openDeleteWorkDetailModal}
        onClose={handleOpenDeleteWorkDetailModal}
        component={
          <DeleteModal
            handleCancel={handleOpenDeleteWorkDetailModal}
            handleDelete={handleDeleteWorkDetail}
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
          handleOpenAddWorkDetailModal={handleOpenAddWorkDetailModal}
          handleOpenEditWorkDetailModal={handleOpenEditWorkDetailModal}
          handleOpenDeleteWorkDetailModal={handleOpenDeleteWorkDetailModal}
          handleLibraryUp={handleLibraryUp}
          handleLibraryDown={handleLibraryDown}
          handleCategoryUp={handleCategoryUp}
          handleCategoryDown={handleCategoryDown}
          handleWorkUp={handleWorkUp}
          handleWorkDown={handleWorkDown}
          handleWorkDetailUp={handleWorkDetailUp}
          handleWorkDetailDown={handleWorkDetailDown}
          level1={librariesData}
        />
      </div>
    </div>
  );
};

export default Index;
