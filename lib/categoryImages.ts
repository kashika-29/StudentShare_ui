/**
 * Category-based default images for listings without user-uploaded images
 * These are local static assets in the public folder
 */

export const getCategoryDefaultImage = (categoryName: string): string => {
  const categoryImages: Record<string, string> = {
    'Electronics': '/images/default-electronics.jpg',
    'Books': '/images/default-books.jpg',
    'Clothing': '/images/default-clothing.jpg',
    'Hostel Essentials': '/images/default-hostel.jpg',
    'Sports': '/images/default-sports.jpg',
    'Academic': '/images/default-academic.jpg',
    'Project Materials': '/images/default-project.jpg',
    'Other': '/images/default-product.jpg',
  };

  return categoryImages[categoryName] || categoryImages['Other'];
};
