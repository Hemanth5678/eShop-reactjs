import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

const MainImage = ({ title, image, setImage }) => {
  useEffect(() => {
    if (image.file) {
      const objectUrl = URL.createObjectURL(image.file);
      setImage((draft) => {
        draft.previewImage = objectUrl;
      });

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image.file]);

  const handleOnChangeFileImage = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (String(event.target.files[0].type).includes('image')) {
      setImage((draft) => {
        draft.file = event.target.files[0];
      });
    } else {
      toast.error('Invalid image file');
    }
  };

  const handleRemoveImage = () => {
    setImage((draft) => {
      draft.file = '';
      draft.previewImage = '';
    });
  };

  return (
    <>
      <span className="block mb-2 text-base font-medium text-gray-900 ">
        {title} (<span className="text-red-600">*</span>):
      </span>
      <div className="text-white text-sm rounded-lg flex gap-3 w-full mb-4">
        <label htmlFor={`${title}-cover-image`} className="block rounded-sm cursor-pointer p-2 bg-green-600">
          {!image.file && 'Add image'}
          {image.file && 'Change image'}
        </label>
        {image.file && (
          <button className="block rounded-sm p-2 bg-red-600" onClick={() => handleRemoveImage('primaryImage')}>
            Remove image
          </button>
        )}
        <input
          key={image.file}
          type="file"
          accept="image/png, image/jpeg"
          id={`${title}-cover-image`}
          className="hidden"
          onChange={(event) => handleOnChangeFileImage(event)}
        />
      </div>
      <div className="border-2 border-dashed rounded-lg p-2.5 h-48">
        {!image.file && <span className="text-gray-400">No image choosen</span>}
        {image.file && <img className="h-full mx-auto" src={image.previewImage} alt={title} title={title} />}
      </div>
    </>
  );
};

MainImage.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  setImage: PropTypes.func.isRequired,
};

export default MainImage;
