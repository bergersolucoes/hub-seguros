
CREATE OR REPLACE FUNCTION public.suggest_brokers_for_lead(
  _lead_id uuid
)
RETURNS TABLE(
  broker_id uuid,
  company_name text,
  trade_name text,
  priority_level integer,
  weekly_capacity integer,
  current_capacity_used integer,
  available_capacity integer,
  region_match boolean,
  product_match boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _product_id uuid;
  _lead_city text;
  _lead_state text;
BEGIN
  SELECT l.product_id, l.city, l.state
  INTO _product_id, _lead_city, _lead_state
  FROM leads l WHERE l.id = _lead_id;

  RETURN QUERY
  SELECT
    b.id AS broker_id,
    b.company_name,
    b.trade_name,
    COALESCE(b.priority_level, 0) AS priority_level,
    COALESCE(b.weekly_capacity, 0) AS weekly_capacity,
    COALESCE(b.current_capacity_used, 0) AS current_capacity_used,
    (COALESCE(b.weekly_capacity, 0) - COALESCE(b.current_capacity_used, 0)) AS available_capacity,
    CASE WHEN EXISTS (
      SELECT 1 FROM broker_regions br
      WHERE br.broker_id = b.id
        AND (br.state IS NULL OR br.state = _lead_state)
        AND (br.city IS NULL OR br.city = _lead_city)
    ) OR NOT EXISTS (
      SELECT 1 FROM broker_regions br WHERE br.broker_id = b.id
    ) THEN true ELSE false END AS region_match,
    CASE WHEN _product_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM broker_products bp
      WHERE bp.broker_id = b.id AND bp.product_id = _product_id AND bp.is_active = true
    ) THEN true
    WHEN _product_id IS NULL THEN true
    ELSE false END AS product_match
  FROM brokers b
  WHERE b.is_active = true
    AND b.accepts_manual_distribution = true
    AND (COALESCE(b.weekly_capacity, 0) = 0 OR COALESCE(b.weekly_capacity, 0) > COALESCE(b.current_capacity_used, 0))
    AND (
      _product_id IS NULL
      OR EXISTS (
        SELECT 1 FROM broker_products bp
        WHERE bp.broker_id = b.id AND bp.product_id = _product_id AND bp.is_active = true
      )
    )
    AND (
      NOT EXISTS (SELECT 1 FROM broker_regions br WHERE br.broker_id = b.id)
      OR EXISTS (
        SELECT 1 FROM broker_regions br
        WHERE br.broker_id = b.id
          AND (br.state IS NULL OR br.state = _lead_state)
          AND (br.city IS NULL OR br.city = _lead_city)
      )
    )
  ORDER BY COALESCE(b.priority_level, 0) DESC, COALESCE(b.current_capacity_used, 0) ASC;
END;
$$;
