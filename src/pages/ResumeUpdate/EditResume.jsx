import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CircleAlert,
  Download,
  Palette,
  Save,
  Trash2,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/Inputs/TitleInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import StepProgress from "../../components/StepProgress";
import ProfileInfoForm from "./Forms/ProfileInfoForm";
import ContactInfoForm from "./Forms/ContactInfoForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import EducationDetailsForm from "./Forms/EducationDetailsForm";
import SkillsInfoForm from "./Forms/SkillsInfoForm";
import ProjectsDetailFrom from "./Forms/ProjectsDetailFrom";
import CertificationInfoFrom from "./Forms/CertificationInfoFrom";
import AdditionalInfoFrom from "./Forms/AdditionalInfoFrom";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { captureElementAsImage, dataURLtoFile, fixTailwindColors } from "../../utils/helper";
import ThemeSelector from "./ThemeSelector";
import Modal from "../../components/Modal";
import EmailPopup from "../../components/EmailPopup";
import { downloadPDF } from "../../utils/pdfGenerator";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [openEmailPopup, setOpenEmailPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "", // e.g. "2022-01"
        endDate: "", // e.g. "2023-12"
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0, // percentage value (0-100)
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0, // percentage value (0-100)
      },
    ],
    interests: [""],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate Inputs
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName || !fullName.trim()) errors.push("Full Name is required");
        if (!designation || !designation.trim()) errors.push("Designation is required");
        if (!summary || !summary.trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone, location } = resumeData.contactInfo;
        if (!location || !location.trim()) errors.push("Address is required");
        if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid email is required.");
        if (!phone || !phone.trim())
          errors.push("Valid phone number is required");
        break;

      case "work-experience":
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim())
              errors.push(`Company is required in experience ${index + 1}`);
            if (!role.trim())
              errors.push(`Role is required in experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in experience ${index + 1}`
              );
          }
        );
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in education ${index + 1}`
              );
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(
              `Skill progress must be between 1 and 100 in skill ${index + 1}`
            );
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(
              `Project description is required in project ${index + 1}`
            );
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim())
            errors.push(
              `Certification title is required in certification ${index + 1}`
            );
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }

        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    // Move to next step
    setErrorMsg("");
    goToNextStep();
  };

  // Function to navigate to the next page
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // Set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to navigate to the previous page
  const goBack = () => {
     const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") navigate("/dashboard");

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // Update progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectsDetailFrom
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoFrom
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
            }
          />
        );

        case "additionalInfo":
        return (
          <AdditionalInfoFrom
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );

      default:
        return null;
    }
  };

  // Update simple nested object (like profileInfo, contactInfo, etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Update array item (like workExperience[0], skills[1], etc.)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value; // for simple strings like in `interests`
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // Add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // Fetch resume info by ID
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if (response.data && response.data._id) {
        const resumeInfo = response.data;

        setResumeData((prevState) => {
          const newProfileImg = prevState.profileInfo?.profileImg || null;
          
          // Check if the database has a blob URL for profilePreviewUrl
          const dbProfilePreviewUrl = resumeInfo?.profileInfo?.profilePreviewUrl;
          
          return {
            ...prevState,
            title: resumeInfo?.title || "Untitled",
            thumbnailLink: resumeInfo?.thumbnailLink || "",
            template: resumeInfo?.template || prevState?.template,
            profileInfo: {
              ...resumeInfo?.profileInfo,
              profileImg: newProfileImg, // Preserve the selected file
              // Keep the blob URL if it exists, it will be used for display
              profilePreviewUrl: dbProfilePreviewUrl || "",
            },
          contactInfo: {
            ...prevState.contactInfo,
            ...resumeInfo?.contactInfo,
          },
          workExperience: resumeInfo?.workExperience && resumeInfo.workExperience.length > 0 
            ? resumeInfo.workExperience 
            : prevState?.workExperience,
          education: resumeInfo?.education && resumeInfo.education.length > 0 
            ? resumeInfo.education 
            : prevState?.education,
          skills: resumeInfo?.skills && resumeInfo.skills.length > 0 
            ? resumeInfo.skills 
            : prevState?.skills,
          projects: resumeInfo?.projects && resumeInfo.projects.length > 0 
            ? resumeInfo.projects 
            : prevState?.projects,
          certifications: resumeInfo?.certifications && resumeInfo.certifications.length > 0 
            ? resumeInfo.certifications 
            : prevState?.certifications,
          languages: resumeInfo?.languages && resumeInfo.languages.length > 0 
            ? resumeInfo.languages 
            : prevState?.languages,
          interests: resumeInfo?.interests && resumeInfo.interests.length > 0 
            ? resumeInfo.interests 
            : prevState?.interests,
          };
        });
      }
    } catch (error) {
      toast.error("Failed to fetch resume");
    }
  };

  // Convert blob URL back to File object for upload
  const blobUrlToFile = async (blobUrl, fileName = 'profile-image.png') => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      toast.error("Failed to convert image");
      return null;
    }
  };

  // upload thumbnail and resume profile img
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      fixTailwindColors(resumeRef.current);
      const imageDataUrl = await captureElementAsImage(resumeRef.current);

      // Convert base64 to File
      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData?.profileInfo?.profileImg || null;
      
      let finalProfileImageFile = profileImageFile;
      
      // If no File object but we have a blob URL, convert it back to File
      if (!profileImageFile && resumeData?.profileInfo?.profilePreviewUrl?.startsWith('blob:')) {
        finalProfileImageFile = await blobUrlToFile(resumeData.profileInfo.profilePreviewUrl, 'profile-image.png');
      }

      const formData = new FormData();
      if (finalProfileImageFile) {
        formData.append("profileImage", finalProfileImageFile);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

      // Update local state with new image URLs
      setResumeData(prev => ({
        ...prev,
        thumbnailLink: thumbnailLink || prev.thumbnailLink,
        profileInfo: {
          ...prev.profileInfo,
          profilePreviewUrl: profilePreviewUrl || prev.profileInfo.profilePreviewUrl,
        }
      }));

      toast.success("Resume Images Updated Successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  // Save resume data without image upload
  const saveResumeData = async () => {
    try {
      setIsLoading(true);


      const updatePayload = {
        ...resumeData,
        // Ensure all array fields are properly formatted
        workExperience: Array.isArray(resumeData.workExperience) ? resumeData.workExperience : [],
        education: Array.isArray(resumeData.education) ? resumeData.education : [],
        skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
        projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
        certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
        languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
        interests: Array.isArray(resumeData.interests) ? resumeData.interests : [],
      };

      // Remove File objects that cannot be serialized to JSON
      if (updatePayload.profileInfo.profileImg) {
        delete updatePayload.profileInfo.profileImg;
      }


      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        updatePayload
      );

      toast.success("Resume Updated Successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to save resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Resume
  const handleDeleteResume = async () => {
     try {
      setIsLoading(true);
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success('Resume Deleted Successfully')
      navigate('/dashboard')
    } catch (err) {
      toast.error("Failed to capture image");
    } finally {
      setIsLoading(false);
    }
  };

  // download resume
  const downloadResume = () => {
    downloadPDF(resumeDownloadRef.current, resumeData.title);
  };

  // Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      // Convert 210mm to pixels (approximately 794px at 96 DPI)
      const a4WidthInPixels = 794;
      setBaseWidth(a4WidthInPixels);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />

          <div className="flex items-center gap-4">
            <button
              className="btn-small-light"
              onClick={() => setOpenThemeSelector(true)}
            >
              <Palette className="text-[16px]" />
              <span className="hidden md:block">Change Theme</span>
            </button>

            <button
              className="btn-small-light"
              onClick={uploadResumeImages}
              disabled={isLoading}
            >
              <Download className="text-[16px]" />
              <span className="hidden md:block">Update Images</span>
            </button>

            <button className="btn-small-light" onClick={handleDeleteResume}>
              <Trash2 className="text-[16px]" />
              <span className="hidden md:block">Delete</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenPreviewModal(true)}
            >
              <Download className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
            <StepProgress progress={progress} />

            {renderForm()}

            <div className="mx-5">
              {errorMsg && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                  <CircleAlert className="text-md" /> {errorMsg}
                </div>
              )}

              <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                <button
                  className="btn-small-light"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="text-[16px]" />
                  Back
                </button>
                <button
                  className="btn-small-light"
                  onClick={saveResumeData}
                  disabled={isLoading}
                >
                  <Save className="text-[16px]" />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>
                <button
                  className="btn-small"
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && (
                    <Download className="text-[16px]" />
                  )}

                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage !== "additionalInfo" && (
                    <ArrowLeft className="text-[16px] rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-auto bg-gray-50 p-4 rounded-lg">
          <div 
            ref={resumeRef} 
            className="bg-white shadow-lg mx-auto"
            style={{
              width: '210mm', // A4 width
              maxWidth: '210mm',
              minHeight: '297mm', // Minimum A4 height
              height: 'auto', // Allow natural height for multi-page
              overflow: 'visible' // Show all content for preview
            }}
          >
            {/* Resume Template */}
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
              containerWidth={baseWidth}
            />
          </div>
          </div>
        </div>
      </div>

      <Modal
          isOpen={openThemeSelector}
          onClose={() => setOpenThemeSelector(false)}
          title="Change Theme"
        >
          <div className="w-[90vw] h-[80vh]">
            <ThemeSelector
              selectedTheme={resumeData?.template}
              setSelectedTheme={(value) => {
                setResumeData((prevState) => ({
                  ...prevState,
                  template: value || prevState.template,
                }));
              }}
              resumeData={null}
              onClose={() => setOpenThemeSelector(false)}
            />
          </div>
        </Modal>

        <Modal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText="Download"
          actionBtnIcon={<Download className="text-[16px]" />}
          onActionClick={downloadResume}
          showSecondaryActionBtn
          secondaryActionBtnText="Send Email"
          secondaryActionBtnIcon={<Mail className="text-[16px]" />}
          onSecondaryActionClick={() => setOpenEmailPopup(true)}
        >
          <div ref={resumeDownloadRef} className="w-[98vw] h-[90vh]">
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
            />
          </div>
        </Modal>

        <EmailPopup
          isOpen={openEmailPopup}
          onClose={() => setOpenEmailPopup(false)}
          resumeId={resumeId}
          resumeTitle={resumeData.title}
          resumePreviewRef={resumeDownloadRef}
        />
    </DashboardLayout>
  );
};

export default EditResume;
