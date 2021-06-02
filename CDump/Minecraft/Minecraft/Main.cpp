#define OLC_PGE_APPLICATION
#include "GraphicsEngine.h"
#include "Json.h"

char JSON::cCurr = '\0';

class Minecraft : public olc::PixelGameEngine {
public:
    Minecraft() {
        sAppName = "Minecraft";
    }

    bool OnUserCreate() override {
        cEngine3D.Construct(ScreenHeight(), ScreenWidth());
        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override {

        cEngine3D.Draw(*this, fElapsedTime);

        return true;
    }

private:
    GraphicsEngine cEngine3D;

};

int main()
{
    //Minecraft demo;
    //if (demo.Construct(250, 250, 4, 4))
    //    demo.Start();
    
    std::shared_ptr<json_t> json;
    if (JSON::parse("Test.json", json)) {
        printf("%.2f\n", *(*json.get())["test2"].GetValue<float>());
	    printf("%s\n", (*json.get())["obj"].GetValue<json_t>()->at("test").GetValue<std::string>()->c_str());
	    printf("%d\n", *(*json.get())["arr"].GetValue<list_t>()->at(1).GetValue<int32_t>());
    }

    return 0;
}
