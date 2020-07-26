#include <string.h>
#include <fstream>

namespace ReactionDiffusionAlg
{
    struct Chemical
    {
        Chemical() : a(1.0), b(0) {}
        Chemical(double a_, double b_) : a(a_), b(b_) {}

        double a;
        double b;
    };

    typedef struct tagBITMAPFILEHEADER
    {
        unsigned short bfType;
        uint32_t bfSize;
        unsigned short bfReserved1;
        unsigned short bfReserved2;
        uint32_t bfOffBits;
    } BITMAPFILEHEADER, *PBITMAPFILEHEADER;

    typedef struct tagBITMAPINFOHEADER
    {
        uint32_t biSize;
        int biWidth;
        int biHeight;
        unsigned short biPlane;
        unsigned short biBitCount;
        uint32_t biCompression;
        uint32_t biSizeImage;
        int biXPelsPerMeter;
        int biYPelsPerMeter;
        uint32_t biClrUsed;
        uint32_t biClrImportant;
    } BITMAPINFOHEADER, *PBITMAPINFOHEADER;

    typedef struct tagRGBQUAD
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
            H = 500
        };

        Diffusion(double feed = 0.055, double kill = 0.062) : feed_(feed), kill_(kill), diffusion_(Chemical(1, 1))
        {
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

            swap(curr, next);
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

        void swap(Chemical a[H][W], Chemical b[H][W])
        {
            for (int i = 0; i < H; i++)
            {
                for (int j = 0; j < W; j++)
                {
                    Chemical temp = b[i][j];
                    b[i][j] = a[i][j];
                    a[i][j] = temp;
                }
            }
        }

        void save()
        {
            std::ofstream img;
            img.open("Diffusion.bmp");

            BITMAPFILEHEADER bmfh;
            BITMAPINFOHEADER bmih;
            unsigned char Palette[1024];

            unsigned char color = 100;

            memset(Palette, 0, 1024);
            memset(&bmfh, 0, sizeof(bmfh));

            int width = 35;
            int height = 50;

            bmfh.bfType = 0x4D42;                                // declare to 'BM'
            bmfh.bfOffBits = sizeof(bmfh) + sizeof(bmih) + 1024; // specifies the offset from the beginning of the file to the bitmap data
            bmfh.bfSize = bmfh.bfOffBits + sizeof(unsigned short) * width * height + height * ((sizeof(unsigned short) * width) % 4);

            memset(&bmih, 0, sizeof(bmih));
            bmih.biSize = sizeof(bmih);
            bmih.biBitCount = 1;
            bmih.biClrUsed = 32768;
            bmih.biCompression = 0;
            bmih.biHeight = height;
            bmih.biWidth = width;
            bmih.biPlane = 1;

            img.write((char *)(&bmfh), sizeof(bmfh));
            img.write((char *)(&bmih), sizeof(bmih));

            img.write((char *)(Palette), 1024);

            for (int row = 0; row < height; row++)
            {
                for (int col = 0; col < width; col++)
                {
                    img.write((char *)(&color), sizeof(color));
                }
                img.write((char *)(Palette), (sizeof(color) * 35) % 4);
            }
        }

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