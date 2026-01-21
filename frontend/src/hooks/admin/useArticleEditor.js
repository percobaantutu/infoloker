import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";

import toast from "react-hot-toast";

export const useArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "", 
    status: "draft",
    tags: "", 
    excerpt: "",
  });

  const [coverImage, setCoverImage] = useState(null); 
  const [coverPreview, setCoverPreview] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(API_PATHS.ADMIN.ARTICLE_OPERATIONS(id));
          const data = response.data;
          
          setFormData({
            title: data.title,
            category: data.category,
            content: data.content,
            status: data.status,
            tags: data.tags.join(", "), 
            excerpt: data.excerpt
          });
          setCoverPreview(data.coverImage);
        } catch (error) {
          toast.error("Failed to fetch article");
          navigate("/admin/articles");
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEditMode, navigate]);

  // 2. Handle Text Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);
    data.append("status", formData.status);
    data.append("tags", formData.tags);
    data.append("excerpt", formData.excerpt);

    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    try {
      if (isEditMode) {
        await axiosInstance.put(API_PATHS.ADMIN.ARTICLE_OPERATIONS(id), data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Article updated");
      } else {
        await axiosInstance.post(API_PATHS.ADMIN.ARTICLES, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Article created");
      }
      navigate("/admin/articles");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };


 const handleEditorImageUpload = async (blobInfo, progress) => {
    try {
      // 1. Get the raw blob
      const blob = blobInfo.blob();
      
      // 2. Convert to a File object with a proper name (Fixes Multer rejection)
      const file = new File([blob], blobInfo.filename(), { type: blob.type });

      // 3. Upload
      const response = await uploadImage(file); 
      return response.imageUrl; 
    } catch (error) {
      console.error("Editor Upload Error:", error);
      throw new Error("Image upload failed");
    }
  };
  return {
    formData,
    coverPreview,
    isLoading,
    isSubmitting,
    isEditMode,
    handleChange,
    handleEditorChange,
    handleImageChange,
    handleEditorImageUpload,
    handleSubmit
  };
};