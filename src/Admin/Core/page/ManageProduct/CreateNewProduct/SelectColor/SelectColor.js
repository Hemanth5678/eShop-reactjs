import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { getListColors } from '~/services/admin/colorService';
import { MdOutlineClear, MdPublishedWithChanges } from 'react-icons/md';
import CustomSelect from '../CustomSelect/CustomSelect';

const SelectColor = ({ listColors, setListColors }) => {
  const [listColorOptions, setListColorOptions] = useImmer([]);

  useEffect(() => {
    refreshListColorOptions();
  }, [listColorOptions, listColors]);

  useEffect(() => {
    fetchListColor();
  }, []);

  const fetchListColor = async () => {
    const response = await getListColors();
    if (response && response.code === 0) {
      if (response?.data && response?.data?.colors.length === 0) {
        toast.error('Please create at least one color before create new product');
        return;
      }
      const listColorOptionsClone = response?.data?.colors.map((color) => {
        return { value: color.id, label: color.name, disabled: false };
      });
      setListColorOptions(listColorOptionsClone);
    } else {
      toast.error(response.message);
    }
  };

  const refreshListColorOptions = () => {
    const listColorSelected = listColors.map((color) => color.id);
    for (const color of listColorOptions) {
      if (color.disabled && !listColorSelected.some((data) => data === color.value)) {
        setListColorOptions((draft) => {
          const index = draft.findIndex((draftColor) => +draftColor.value === +color.value);
          if (index !== -1) {
            draft[index].disabled = false;
          }
        });
      }
    }
  };

  const handleSelectColor = (event, index) => {
    setListColorOptions((draft) => {
      const index = draft.findIndex((color) => +color.value === +event.value);
      if (index !== -1) {
        draft[index].disabled = true;
      }
    });
    setListColors((draft) => {
      draft[index].id = event.value;
      draft[index].name = event.label;
    });
  };

  const handleOnChangeImage = (event, colorIndex) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (String(event.target.files[0].type).includes('image')) {
      setListColors((draft) => {
        draft[colorIndex].images.push({
          id: uuidv4(),
          file: event.target.files[0],
          previewImage: URL.createObjectURL(event.target.files[0]),
        });
      });
    } else {
      toast.error('Invalid image file');
    }
  };

  const handleRemoveImage = (colorIndex, imageIndex) => {
    setListColors((draft) => {
      draft[colorIndex].images.splice(imageIndex, 1);
    });
  };

  const handleUpdateImage = (event, colorIndex, imageIndex) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (String(event.target.files[0].type).includes('image')) {
      setListColors((draft) => {
        draft[colorIndex].images[imageIndex].file = event.target.files[0];
        draft[colorIndex].images[imageIndex].previewImage = URL.createObjectURL(event.target.files[0]);
      });
    } else {
      toast.error('Invalid image file');
    }
  };

  const handleRemoveColor = (colorIndex) => {
    setListColors((draft) => {
      draft.splice(colorIndex, 1);
    });
  };

  return (
    <>
      {listColors &&
        listColors.map((color, colorIndex) => (
          <div key={`color-${color.id}-${colorIndex}`} className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block mb-2 text-base font-medium text-gray-900 ">Color {colorIndex + 1}:</label>
                <CustomSelect
                  options={listColorOptions}
                  isOptionDisabled={(option) => option.disabled}
                  onChange={(event) => handleSelectColor(event, colorIndex, color.id)}
                  placeholder={color.name ? color.name : 'Select color...'}
                />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <div className="flex-1">
                  <div className="flex flex-wrap">
                    {color.images &&
                      color.images.map((image, imageIndex) => (
                        <React.Fragment key={`image-color-${color.id}-${colorIndex}-${imageIndex}`}>
                          {image.file && (
                            <div className="relative border-2 border-dashed rounded-lg w-20 h-[100px] mr-4 mb-4">
                              <img
                                className="w-full h-full mx-auto my-auto rounded-lg object-contain"
                                src={image.previewImage}
                                alt={`Color-${color.name}-${imageIndex}`}
                                title={`Color-${color.name}-${imageIndex}`}
                              />
                              <label
                                htmlFor={`product-color-update-${color.id}-image-${imageIndex}`}
                                className="absolute -top-2 right-5 w-5 h-5 rounded-full text-white bg-green-600 flex items-center justify-center cursor-pointer"
                              >
                                <MdPublishedWithChanges className="text-xs" />
                              </label>
                              <input
                                key={image.file}
                                type="file"
                                accept="image/png, image/jpeg"
                                id={`product-color-update-${color.id}-image-${imageIndex}`}
                                className="hidden"
                                onChange={(event) => handleUpdateImage(event, colorIndex, imageIndex)}
                              />
                              <button
                                className="absolute -top-2 -right-1 w-5 h-5 rounded-full text-white bg-red-600 flex items-center justify-center"
                                onClick={() => handleRemoveImage(colorIndex, imageIndex)}
                              >
                                <MdOutlineClear className="text-xs" />
                              </button>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    <div className="border-2 border-dashed rounded-lg w-20 h-[100px] mr-4 mb-4">
                      <label
                        htmlFor={`product-color-${color.id}-image-${colorIndex}`}
                        className="block h-full leading-[100px] text-sm text-center text-gray-300 cursor-pointer"
                      >
                        Add image
                      </label>
                      <input
                        key={color.images.length}
                        type="file"
                        accept="image/png, image/jpeg"
                        id={`product-color-${color.id}-image-${colorIndex}`}
                        className="hidden"
                        onChange={(event) => handleOnChangeImage(event, colorIndex)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[60px] h-[100px] flex items-center justify-center">
                  {listColors.length > 1 && (
                    <button className="cursor-pointer hover:text-red-600" onClick={() => handleRemoveColor(colorIndex)}>
                      Remove
                      <br />
                      color
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default SelectColor;
