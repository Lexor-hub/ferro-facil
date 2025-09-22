-- Criar carrossel para Tecnologia e Processo
INSERT INTO public.carousels (key, title, created_at)
VALUES ('tecnologia-processo', 'Tecnologia e Processo', NOW());

-- Obter o ID do carrossel criado
DO $$
DECLARE
    carousel_id UUID;
BEGIN
    -- Buscar o ID do carrossel criado
    SELECT id INTO carousel_id
    FROM public.carousels
    WHERE key = 'tecnologia-processo';

    -- Inserir itens de exemplo
    INSERT INTO public.carousel_items (carousel_id, image_url, alt_text, sort_order, is_active, created_at)
    VALUES
        (carousel_id, 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=CNC+Machines', 'Máquinas CNC de precisão para corte e usinagem', 1, true, NOW()),
        (carousel_id, 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Quality+Control', 'Sistema de controle de qualidade e medição', 2, true, NOW()),
        (carousel_id, 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Automation', 'Automação e tecnologia de produção', 3, true, NOW());

    RAISE NOTICE 'Carrossel tecnologia-processo criado com sucesso!';
END $$;