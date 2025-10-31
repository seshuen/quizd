-- Function to get distinct categories efficiently
-- This prevents fetching all topics just to get unique categories

CREATE OR REPLACE FUNCTION get_distinct_categories()
RETURNS TABLE (category text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT t.category
  FROM topics t
  ORDER BY t.category;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment for documentation
COMMENT ON FUNCTION get_distinct_categories() IS
'Returns distinct category values from the topics table.
Used by the CategoryFilter component for efficient category listing.';
