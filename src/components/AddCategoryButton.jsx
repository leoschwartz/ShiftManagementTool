import { useState } from "react";
import { useAtom } from "jotai";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { userIdAtom } from "../globalAtom";
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

// eslint-disable-next-line react/prop-types
const AddCategoryButton = ({ userToken }) => {
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId] = useAtom(userIdAtom);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleAddCategory = async () => {
    try {
      const createCategoryResponse = await fetch(import.meta.env.VITE_API_URL + "/categories/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          managerId: userId,
        }),
      });
      if (createCategoryResponse.ok) {
        const newCategory = await createCategoryResponse.json();
        const categoryId = newCategory.id;

        const updateUserResponse = await fetch(import.meta.env.VITE_API_URL + "/manager/addCategory", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            managerId: userId,
            managerUpdatedData: {
              addCategory: categoryId,
            },
          }),
        });

        if (updateUserResponse.ok) {
          console.log("Category list updated!");
          setShowSuccessToast(true);
          setShowAddCategoryPopup(false);
        } else {
          console.error("Failed to update user category list");
          setShowErrorToast(true);
        }
      } else {
        console.error("Failed to create category");
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setShowErrorToast(true);
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddCategoryPopup(true)} className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2" style={{ zIndex: 10 }}>Add Category</Button>
      <Modal show={showAddCategoryPopup} size="md" popup onClose={() => setShowAddCategoryPopup(false)}>
        <Modal.Body>
          <div className="space-y-6">
            <br />
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="categoryName" value="Name:" />
              </div>
              <TextInput
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="categoryDescription" value="Description:" />
              </div>
              <TextInput
                id="categoryDescription"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddCategory} className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded mr-2">Add</Button>
              <Button onClick={() => setShowAddCategoryPopup(false)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showSuccessToast && (
        <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Category added.</div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}
      {showErrorToast && (
        <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Failed to add category.</div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </>
  );
};

export default AddCategoryButton;

