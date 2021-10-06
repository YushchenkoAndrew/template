#include "../CuttingCorners.h"
#include "TypeList.h"

namespace CuttingCorners {
  template <class T>
  struct OpNewCreator {
    static T* Create() {
      printf("[struct] OpNewCreator::Create\n");
      return new T;
    }
  };

  template <class T>
  struct MallocCreate {
    static T* Create() {
      printf("[struct] MallocCreate::Create\n");
      void* buff = std::malloc(sizeof(T));
      if (!buff) return nullptr;
      return new(buff) T;
    }
  };

  template <class T>
  struct CreationPolicy {
    CreationPolicy() {}
  };

  template <template <class> class CreationPolicy>
  class WidgetManager {
    public:
    void DoSmth() {
      printf("[class] WidgetManager::DoSmth\n");
      EmptyType* test = CreationPolicy<EmptyType>().Create();
      test->Test();
    }
  };
};
