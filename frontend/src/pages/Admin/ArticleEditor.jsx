import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { useArticleEditor } from "../../hooks/admin/useArticleEditor";
import { Save, Image as ImageIcon, ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextAreaField from "../../components/Input/TextAreaField";
import { ARTICLE_CATEGORIES } from "../../utils/data"; 

const ArticleEditor = () => {
  const navigate = useNavigate();
  const {
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
  } = useArticleEditor();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-screen flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  // Transform generic categories to select options
  const categoryOptions = ARTICLE_CATEGORIES.map(c => ({ value: c.value, label: c.label }));

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/articles")}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Article" : "Write New Article"}
            </h1>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isEditMode ? "Update" : "Publish"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <InputField
                label="Article Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title..."
                required
              />
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <Editor
                        apiKey="4qdbnuf8yikk4vk14nws6o3xcbiu3g291iwao86hxvx5itya"
                        value={formData.content}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | image link | help',
                            content_style: 'body { font-family:Plus Jakarta Sans,Helvetica,Arial,sans-serif; font-size:14px }',
                            // Wire up the image upload to Cloudinary
                            images_upload_handler: handleEditorImageUpload
                        }}
                    />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <TextAreaField 
                    label="Excerpt"
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Short summary for SEO and cards..."
                    rows={3}
                />
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            
            {/* Status & Category */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-900">Settings</h3>
                
                <SelectField
                    label="Status"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" },
                    ]}
                />

                <SelectField
                    label="Category"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={ARTICLE_CATEGORIES} 
                    required 
                />

                <InputField
                    label="Tags (Comma separated)"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tech, Career, Interview..."
                />
            </div>

            {/* Cover Image */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Cover Image</label>
                
                <div className="relative group w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors">
                    {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-xs text-gray-500">Upload Cover</span>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                    />
                </div>
            </div>

          </div>
        </div>

      </form>
    </AdminLayout>
  );
};

export default ArticleEditor;