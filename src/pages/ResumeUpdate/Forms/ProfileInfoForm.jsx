import React from 'react'
import ProfilePhotoSelector from "../../../components/Inputs/ProfilePhotoSelector";
import Input from "../../../components/Inputs/Input";

const ProfileInfoForm = ({profileData, updateSection}) => {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>

      <div className="mt-4">
        <ProfilePhotoSelector
          image={profileData?.profileImg}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label="Full Name"
            placeholder="Your Full Name"
            type="text"
          />

          <Input
            value={profileData.designation || ""}
            onChange={({ target }) =>
              updateSection("designation", target.value)
            }
            label="Designation"
            placeholder="Your Designation"
            type="text"
          />

          <Input
            value={profileData.gender || ""}
            onChange={({ target }) =>
              updateSection("gender", target.value)
            }
            label="Gender"
            placeholder="Select Gender"
            type="select"
            options={[
              { value: "", label: "Select Gender" },
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
              { value: "OTHERS", label: "Others" }
            ]}
          />

          <Input
            value={profileData.nationality || ""}
            onChange={({ target }) =>
              updateSection("nationality", target.value)
            }
            label="Nationality"
            placeholder="Your Nationality"
            type="text"
          />

          <Input
            value={profileData.dateOfBirth || ""}
            onChange={({ target }) =>
              updateSection("dateOfBirth", target.value)
            }
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            type="date"
          />

          <div className="col-span-2 mt-3">
            <label className="text-xs font-medium text-slate-600">
              Summary
            </label>

            <textarea
              placeholder="Short Introduction"
              className="form-input"
              rows={4}
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoForm