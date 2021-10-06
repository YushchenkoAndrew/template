// #include "../include/CuttingCorners.h"
#include "../include/CuttingCorners/Strategy.h"

struct TestSubject {
  TestSubject() {
    printf("HELLO WORLD");
  }
};

int main() {
  CuttingCorners::WidgetManager<CuttingCorners::OpNewCreator> tempWidget;
  tempWidget.DoSmth();

  return 0;
}

