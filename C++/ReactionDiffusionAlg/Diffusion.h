#include <string.h>
#include <fstream>
#include "lib/bitmap_image.hpp"
#include <cmath>
#include <string>

namespace ReactionDiffusionAlg
{
    struct Chemical
    {
        Chemical() : a(1.0), b(0) {}
        Chemical(double a_, double b_) : a(a_), b(b_) {}

        double a;
        double b;
    };

    struct BITMAPFILEHEADER
    {
        unsigned short bfType{0x4D42};
        unsigned long bfSize{0};
        unsigned short bfReserved1{0};
        unsigned short bfReserved2{0};
        unsigned long bfOffBits{0};
    };

    struct BITMAPINFOHEADER
    {
        unsigned long biSize{0};
        unsigned long biWidth{0};
        unsigned long biHeight{0};
        unsigned short biPlane{1};
        unsigned short biBitCount{0};
        unsigned long biCompression{0};
        unsigned long biSizeImage{0};
        unsigned long biXPelsPerMeter{0};
        unsigned long biYPelsPerMeter{0};
        unsigned long biClrUsed{0};
        unsigned long biClrImportant{0};
    };

    typedef struct RGBQUAD
    {
        unsigned char rgbBlue;
        unsigned char rgbGreen;
        unsigned char rgbRed;
        unsigned char rgbReserved;
    } RGBQUAD;

    class Diffusion
    {

    public:
        enum
        {
            W = 500,
            H = 500,
        };

        Diffusion(double feed = 0.0367, double kill = 0.0649) : feed_(feed), kill_(kill), diffusion_(Chemical(1, 0.5))
        {
            addChemical(W / 2, H / 2);
        }

        void addChemical(int x, int y, int range = 10)
        {
            for (int i = -range; i < range; i++)
            {
                for (int j = -range; j < range; j++)
                {
                    curr[i + y][j + x].b = 1;
                }
            }
        }

        void update()
        {
            for (int i = 1; i < H - 1; i++)
            {
                for (int j = 1; j < W - 1; j++)
                {

                    double a = curr[i][j].a;
                    double b = curr[i][j].b;

                    Chemical laplace = LaplacianFunc(j, i);

                    next[i][j].a = a + (diffusion_.a * laplace.a - a * b * b + feed_ * (1 - a));
                    next[i][j].b = b + (diffusion_.b * laplace.b + a * b * b - (kill_ + feed_) * b);
                }
            }

            swap();
            epoch++;
        }

        Chemical LaplacianFunc(int x, int y)
        {
            Chemical result = Chemical(0, 0);

            for (int i = -1; i < 2; i++)
            {
                for (int j = -1; j < 2; j++)
                {
                    result.a += curr[y + i][x + j].a * weight[i + 1][j + 1];
                    result.b += curr[y + i][x + j].b * weight[i + 1][j + 1];
                }
            }

            return result;
        }

        void swap()
        {
            for (int i = 0; i < H; i++)
            {
                for (int j = 0; j < W; j++)
                {
                    Chemical temp = curr[i][j];
                    curr[i][j] = next[i][j];
                    next[i][j] = temp;
                }
            }
        }

        // void save()
        // {
        //     std::ofstream img{"Diffusion.bmp", std::ios_base::binary};

        //     BITMAPFILEHEADER bmfh;
        //     BITMAPINFOHEADER bmih;
        //     RGBQUAD color = {0, 0, 255, 255};

        //     memset(&color, 0, sizeof(RGBQUAD));
        //     memset(&bmfh, 0, sizeof(bmfh));

        //     int width = 35;
        //     int height = 50;

        //     bmfh.bfType = 0x4D42;                                         // declare to 'BM'
        //     bmfh.bfOffBits = sizeof(bmfh) + sizeof(bmih) + sizeof(color); // specifies the offset from the beginning of the file to the bitmap data
        //     bmfh.bfSize = bmfh.bfOffBits + sizeof(unsigned short) * width * height + height * ((sizeof(unsigned short) * width) % 4);

        //     memset(&bmih, 0, sizeof(bmih));
        //     bmih.biSize = sizeof(bmih);
        //     bmih.biBitCount = 1;
        //     bmih.biClrUsed = 32768;
        //     bmih.biCompression = 0;
        //     bmih.biHeight = height;
        //     bmih.biWidth = width;
        //     bmih.biPlane = 1;

        //     img.write((const char *)(&bmfh), sizeof(bmfh));
        //     img.write((const char *)(&bmih), sizeof(bmih));

        //     img.write((const char *)(&color), sizeof(color));

        //     for (int row = 0; row < height; row++)
        //     {
        //         for (int col = 0; col < width; col++)
        //         {
        //             img.write((char *)(&color), sizeof(color));
        //         }
        //         img.write((char *)(&color), (sizeof(color) * 35) % 4);
        //     }
        // }

        void save()
        {
            bitmap_image image(W, H);
            image.clear();

            for (unsigned int i = 0; i < image.height(); i++)
            {
                for (unsigned int j = 0; j < image.width(); j++)
                {
                    double a = curr[i][j].a;
                    double b = curr[i][j].b;
                    double sub = a - b;

                    unsigned char color = floor(sub < 0 ? 0 : sub * 255);
                    image.set_pixel(j, i, color, color, color);
                }
            }

            image.save_image("Diffusion" + std::to_string(epoch) + ".bmp");
        }

        int epoch = 0;

    private:
        Chemical curr[H][W];
        Chemical next[H][W];
        double feed_;
        double kill_;
        Chemical diffusion_;
        double weight[3][3] = {
            {0.05, 0.2, 0.05},
            {0.2, -1, 0.2},
            {0.05, 0.2, 0.05},
        };
    };
} // namespace ReactionDiffusionAlg