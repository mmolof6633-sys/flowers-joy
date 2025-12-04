'use client';

import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState, useRef, ReactNode, useEffect } from 'react';

interface CarouselProps {
  children: ReactNode;
  maxItemsDesktop?: number;
  spacing?: number;
}

export function Carousel({ children, maxItemsDesktop = 4, spacing = 3 }: CarouselProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Проверяем состояние скролла при загрузке и изменении размера окна
  useEffect(() => {
    // Небольшая задержка для корректного расчета размеров после рендера
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const container = scrollContainerRef.current;
    if (!container) {
      clearTimeout(timer);
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Стрелки навигации для десктопа */}
      {!isMobile && (
        <>
          <IconButton
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            sx={{
              position: 'absolute',
              left: { xs: -10, sm: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            sx={{
              position: 'absolute',
              right: { xs: -10, sm: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Контейнер с горизонтальным скроллом */}
      <Box
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        sx={{
          display: 'flex',
          gap: spacing,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: isMobile ? 8 : 0,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
          // Скрываем скроллбар на десктопе
          ...(!isMobile && {
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }),
          // Настройка ширины элементов
          '& > *': {
            flexShrink: 0,
            ...(isMobile
              ? {
                  width: (theme) => `calc(85vw - ${theme.spacing(spacing)})`,
                  minWidth: (theme) => `calc(85vw - ${theme.spacing(spacing)})`,
                }
              : {
                  width: (theme) =>
                    `calc((100% - ${theme.spacing((maxItemsDesktop - 1) * spacing)}) / ${maxItemsDesktop})`,
                  minWidth: (theme) =>
                    `calc((100% - ${theme.spacing((maxItemsDesktop - 1) * spacing)}) / ${maxItemsDesktop})`,
                }),
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
